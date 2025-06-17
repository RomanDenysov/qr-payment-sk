'use server';

import {
  generateQRCodeAnonymous,
  generateQRCodeAuth,
} from '@/app/actions/qr-codes';
import db from '@/db';
import { profilesTable, qrGenerationsTable } from '@/db/schema';
import { handleApiError } from '@/lib/errors';
import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';

// POST endpoint for QR generation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = await auth();

    // Use appropriate action based on authentication
    if (userId) {
      const result = await generateQRCodeAuth(body);

      if (result?.serverError) {
        return Response.json(
          {
            error: result.serverError.message,
            code: result.serverError.code,
          },
          { status: result.serverError.statusCode || 400 }
        );
      }

      if (result?.validationErrors) {
        return Response.json(
          {
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: result.validationErrors,
          },
          { status: 400 }
        );
      }

      return Response.json({
        success: true,
        data: result?.data,
      });
    }

    // Anonymous user
    const result = await generateQRCodeAnonymous(body);

    if (result?.serverError) {
      return Response.json(
        {
          error: result.serverError.message,
          code: result.serverError.code,
        },
        { status: result.serverError.statusCode || 400 }
      );
    }

    if (result?.validationErrors) {
      return Response.json(
        {
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: result.validationErrors,
        },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      data: result?.data,
    });
  } catch (error) {
    return handleApiError(error, request.url);
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
    return handleApiError(error, request.url);
  }
}
