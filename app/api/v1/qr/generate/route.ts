'use server';

import db from '@/db';
import {
  profilesTable,
  qrGenerationsTable,
  subscriptionsTable,
} from '@/db/schema';
import { validateSlovakIban } from '@/lib/format-utils';
import { getBySquareQR } from '@/lib/get-bysquare-qr';
import { auth } from '@clerk/nextjs/server';
import { and, count, eq, gte } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { z } from 'zod';

// Rate limits by plan
const RATE_LIMITS = {
  anonymous: { limit: 10, window: '7d' },
  free: { limit: 150, window: '30d' },
  starter: { limit: 500, window: '30d' },
  professional: { limit: -1, window: '30d' }, // Unlimited
} as const;

// QR generation schema
const qrGenerationSchema = z.object({
  iban: z
    .string()
    .regex(/^SK\d{22}$/, 'Invalid Slovak IBAN format')
    .refine(
      (iban) => validateSlovakIban(iban),
      'Invalid Slovak IBAN or incorrect checksum'
    ),
  amount: z.number().min(0.01).max(99999999.99),
  variableSymbol: z
    .string()
    .regex(/^\d{1,10}$/)
    .optional(),
  constantSymbol: z
    .string()
    .regex(/^\d{1,4}$/)
    .optional(),
  specificSymbol: z
    .string()
    .regex(/^\d{1,10}$/)
    .optional(),
  message: z.string().max(140).optional(),
});

type QrGenerationData = z.infer<typeof qrGenerationSchema>;

// Error types
class QrGenerationError extends Error {
  code: string;
  statusCode: number;

  constructor(message: string, code: string, statusCode = 400) {
    super(message);
    this.name = 'QrGenerationError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

// Generate unique variable symbol
async function generateUniqueVariableSymbol(): Promise<string> {
  const maxAttempts = 10;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Timestamp + random component for uniqueness
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits
    const random = Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, '0');
    const variableSymbol = timestamp + random;

    // Check uniqueness in database
    const existing = await db
      .select()
      .from(qrGenerationsTable)
      .where(eq(qrGenerationsTable.variableSymbol, BigInt(variableSymbol)))
      .limit(1);

    if (!existing.length) {
      return variableSymbol;
    }
  }

  throw new QrGenerationError(
    'Failed to generate unique variable symbol',
    'VARIABLE_SYMBOL_GENERATION_FAILED',
    500
  );
}

// Get client IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP.trim();
  }

  return 'unknown';
}

// Anonymous rate limiting (IP-based)
async function checkAnonymousRateLimit(ip: string): Promise<void> {
  // This is a simplified implementation
  // In production, use Redis or similar for distributed rate limiting
  const limit = RATE_LIMITS.anonymous.limit;
  const windowStart = new Date();
  windowStart.setDate(windowStart.getDate() - 7); // 7 days ago

  // Count QR generations from this IP in the last week
  // Note: This requires adding IP tracking to qrGenerationsTable or separate tracking
  // For now, we'll use a simple approach

  // TODO: Implement proper IP-based rate limiting with Redis/KV store
  // This is a placeholder that always allows requests for now
  console.log(`Anonymous rate limit check for IP ${ip}: ${limit} per week`);
}

// User rate limiting
async function checkUserRateLimit(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  plan: string;
  resetDate: Date;
}> {
  // Get user profile
  const profile = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.clerkId, userId))
    .limit(1);

  if (!profile.length) {
    throw new QrGenerationError(
      'User profile not found',
      'PROFILE_NOT_FOUND',
      404
    );
  }

  // Get user subscription
  const subscription = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.userId, profile[0].id))
    .limit(1);

  const plan = subscription[0]?.plan || 'free';
  const planConfig = RATE_LIMITS[plan as keyof typeof RATE_LIMITS];

  // Check subscription status
  if (subscription[0]?.status === 'past_due') {
    throw new QrGenerationError(
      'Payment required to continue using the service',
      'PAYMENT_REQUIRED',
      402
    );
  }

  if (subscription[0]?.status === 'canceled') {
    throw new QrGenerationError(
      'Subscription canceled',
      'SUBSCRIPTION_CANCELED',
      403
    );
  }

  // Calculate period start
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1); // Start of current month

  // Count current period usage
  const usage = await db
    .select({ count: count() })
    .from(qrGenerationsTable)
    .where(
      and(
        eq(qrGenerationsTable.userId, profile[0].id),
        gte(qrGenerationsTable.generatedAt, periodStart)
      )
    );

  const used = usage[0].count;
  const limit = planConfig.limit;

  // Check if limit exceeded
  if (limit !== -1 && used >= limit) {
    throw new QrGenerationError(
      'Monthly QR generation limit exceeded',
      'RATE_LIMIT_EXCEEDED',
      429
    );
  }

  // Calculate reset date (start of next month)
  const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return {
    allowed: true,
    remaining: limit === -1 ? -1 : Math.max(0, limit - used),
    plan,
    resetDate,
  };
}

// Main QR generation function
async function generateQr(
  data: QrGenerationData,
  userId?: string
): Promise<{
  id: string;
  qrData: string;
  variableSymbol: string;
}> {
  // Generate variable symbol if not provided
  const variableSymbol =
    data.variableSymbol || (await generateUniqueVariableSymbol());

  // Generate BySquare QR data
  const qrData = await getBySquareQR({
    iban: data.iban,
    amount: data.amount,
    variableSymbol,
    paymentNote: data.message,
  });

  // For authenticated users, save to database
  if (userId) {
    const profile = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.clerkId, userId))
      .limit(1);

    if (profile.length) {
      const qrGeneration = await db
        .insert(qrGenerationsTable)
        .values({
          userId: profile[0].id,
          templateName: 'API Generated',
          amount: data.amount.toString(),
          variableSymbol: BigInt(variableSymbol),
          qrData,
          iban: data.iban,
          description: data.message,
          status: 'generated',
        })
        .returning();

      return {
        id: qrGeneration[0].id,
        qrData,
        variableSymbol,
      };
    }
  }

  // For anonymous users, return without saving
  return {
    id: `anonymous-${Date.now()}`,
    qrData,
    variableSymbol,
  };
}

// POST endpoint for QR generation
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input data
    const validationResult = qrGenerationSchema.safeParse(body);
    if (!validationResult.success) {
      return Response.json(
        {
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check authentication
    const { userId } = await auth();

    if (userId) {
      // Authenticated user - check user rate limits
      const rateLimitResult = await checkUserRateLimit(userId);

      // Generate QR code
      const result = await generateQr(data, userId);

      return Response.json({
        success: true,
        data: {
          qrId: result.id,
          qrData: result.qrData,
          variableSymbol: result.variableSymbol,
        },
        rateLimit: {
          remaining: rateLimitResult.remaining,
          resetDate: rateLimitResult.resetDate.toISOString(),
          plan: rateLimitResult.plan,
        },
      });
    }

    // Anonymous user - check IP-based rate limits
    const clientIP = getClientIP(request);
    await checkAnonymousRateLimit(clientIP);

    // Generate QR code
    const result = await generateQr(data);

    return Response.json({
      success: true,
      data: {
        qrId: result.id,
        qrData: result.qrData,
        variableSymbol: result.variableSymbol,
      },
      rateLimit: {
        remaining: RATE_LIMITS.anonymous.limit, // Simplified for demo
        resetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        plan: 'anonymous',
      },
    });
  } catch (error) {
    console.error('QR generation error:', error);

    if (error instanceof QrGenerationError) {
      return Response.json(
        {
          error: error.message,
          code: error.code,
        },
        { status: error.statusCode }
      );
    }

    if (error instanceof z.ZodError) {
      return Response.json(
        {
          error: 'Invalid input data',
          code: 'VALIDATION_ERROR',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}

// GET endpoint for retrieving QR code
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const qrId = searchParams.get('id');

    if (!qrId) {
      return Response.json(
        {
          error: 'QR ID is required',
          code: 'MISSING_QR_ID',
        },
        { status: 400 }
      );
    }

    // Check authentication for database lookup
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        {
          error: 'Authentication required',
          code: 'UNAUTHORIZED',
        },
        { status: 401 }
      );
    }

    // Get user profile
    const profile = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.clerkId, userId))
      .limit(1);

    if (!profile.length) {
      return Response.json(
        {
          error: 'User profile not found',
          code: 'PROFILE_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Find QR generation
    const qrGeneration = await db
      .select()
      .from(qrGenerationsTable)
      .where(
        and(
          eq(qrGenerationsTable.id, qrId),
          eq(qrGenerationsTable.userId, profile[0].id)
        )
      )
      .limit(1);

    if (!qrGeneration.length) {
      return Response.json(
        {
          error: 'QR code not found',
          code: 'QR_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    const qr = qrGeneration[0];

    return Response.json({
      success: true,
      data: {
        id: qr.id,
        qrData: qr.qrData,
        variableSymbol: qr.variableSymbol.toString(),
        amount: qr.amount,
        iban: qr.iban,
        description: qr.description,
        generatedAt: qr.generatedAt.toISOString(),
        status: qr.status,
      },
    });
  } catch (error) {
    console.error('QR retrieval error:', error);

    return Response.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}
