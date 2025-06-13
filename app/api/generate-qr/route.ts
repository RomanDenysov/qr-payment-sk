import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for the request
const qrRequestSchema = z.object({
  iban: z
    .string()
    .min(1, 'IBAN je povinný')
    .regex(
      /^SK\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/i,
      'Prosím zadajte platný slovenský IBAN'
    ),
  amount: z
    .string()
    .min(1, 'Suma je povinná')
    .refine((val) => {
      const num = Number.parseFloat(val);
      return !Number.isNaN(num) && num > 0;
    }, 'Suma musí byť kladné číslo'),
  recipientName: z.string().min(1, 'Meno príjemcu je povinné').trim(),
  description: z.string().optional(),
  variableSymbol: z.string().optional(),
  constantSymbol: z.string().optional(),
  specificSymbol: z.string().optional(),
});

type QRRequest = z.infer<typeof qrRequestSchema>;

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body: unknown = await request.json();

    const validationResult = qrRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const qrData: QRRequest = validationResult.data;

    // Get QR service URL from environment or use default
    const qrServiceUrl = process.env.QR_SERVICE_URL || 'http://localhost:8080';

    // Call the PHP QR service
    const response = await fetch(`${qrServiceUrl}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        iban: qrData.iban,
        amount: qrData.amount,
        recipientName: qrData.recipientName,
        description: qrData.description || undefined,
        variableSymbol: qrData.variableSymbol || undefined,
        constantSymbol: qrData.constantSymbol || undefined,
        specificSymbol: qrData.specificSymbol || undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: 'QR service unavailable',
      }));

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to generate QR code',
          details: errorData,
        },
        { status: response.status }
      );
    }

    const result = await response.json();

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'QR generation failed',
          details: result.details || {},
        },
        { status: 400 }
      );
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      qrString: result.qrString,
      metadata: result.metadata,
    });
  } catch (error) {
    console.error('QR API Error:', error);

    // Handle network errors or service unavailable
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        {
          success: false,
          error: 'QR service is currently unavailable',
        },
        { status: 503 }
      );
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request format',
        },
        { status: 400 }
      );
    }

    // Generic error handler
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    const qrServiceUrl = process.env.QR_SERVICE_URL || 'http://localhost:8080';

    // Check if QR service is available
    const response = await fetch(`${qrServiceUrl}/health`, {
      method: 'GET',
    });

    const healthData = await response.json().catch(() => ({}));

    return NextResponse.json({
      status: 'ok',
      qrService: {
        available: response.ok,
        status: response.status,
        ...healthData,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: 'degraded',
      qrService: {
        available: false,
        error: 'Service unavailable',
      },
      timestamp: new Date().toISOString(),
    });
  }
}
