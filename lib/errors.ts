// Base error interface for consistent error structure
export interface ErrorResponse {
  statusCode: string;
  message: string;
  details?: unknown;
  timestamp?: string;
  path?: string;
}

// Standard status codes for the application
export const ERROR_CODES = {
  // Success codes (10000-10999)
  SUCCESS: '10000',

  // Client errors (40000-49999)
  BAD_REQUEST: '40000',
  UNAUTHORIZED: '40001',
  FORBIDDEN: '40003',
  NOT_FOUND: '40004',
  VALIDATION_ERROR: '40005',
  RATE_LIMIT_EXCEEDED: '40029',

  // Server errors (50000-59999)
  INTERNAL_ERROR: '50000',
  DATABASE_ERROR: '50001',
  EXTERNAL_API_ERROR: '50002',

  // Business logic errors (60000-69999)
  PROFILE_NOT_FOUND: '60001',
  SUBSCRIPTION_REQUIRED: '60002',
  QR_GENERATION_FAILED: '60003',
  IBAN_VALIDATION_FAILED: '60004',
  VARIABLE_SYMBOL_GENERATION_FAILED: '60005',
  FEATURE_NOT_AVAILABLE: '60006',
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

// Base application error class
export abstract class AppError extends Error {
  abstract readonly statusCode: string;
  abstract readonly httpStatus: number;
  abstract readonly isOperational: boolean;

  readonly timestamp: string;
  readonly details?: unknown;

  constructor(message: string, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date().toISOString();
    this.details = details;

    // Ensure the stack trace points to where the error was thrown
    Error.captureStackTrace(this, this.constructor);
  }

  // Convert error to standard response format
  toResponse(path?: string): ErrorResponse {
    return {
      statusCode: this.statusCode,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
      path,
    };
  }
}

// Validation errors (user input issues)
export class ValidationError extends AppError {
  readonly statusCode = ERROR_CODES.VALIDATION_ERROR;
  readonly httpStatus = 400;
  readonly isOperational = true;
}

// Authentication errors
export class AuthenticationError extends AppError {
  readonly statusCode = ERROR_CODES.UNAUTHORIZED;
  readonly httpStatus = 401;
  readonly isOperational = true;
}

// Authorization errors
export class AuthorizationError extends AppError {
  readonly statusCode = ERROR_CODES.FORBIDDEN;
  readonly httpStatus = 403;
  readonly isOperational = true;
}

// Rate limiting errors
export class RateLimitError extends AppError {
  readonly statusCode = ERROR_CODES.RATE_LIMIT_EXCEEDED;
  readonly httpStatus = 429;
  readonly isOperational = true;
}

// Resource not found errors
export class NotFoundError extends AppError {
  readonly statusCode = ERROR_CODES.NOT_FOUND;
  readonly httpStatus = 404;
  readonly isOperational = true;
}

// Business logic errors
export class BusinessLogicError extends AppError {
  readonly httpStatus = 400;
  readonly isOperational = true;

  constructor(
    message: string,
    private readonly code: ErrorCode,
    details?: unknown
  ) {
    super(message, details);
  }

  get statusCode(): string {
    return ERROR_CODES[this.code];
  }
}

// Database errors
export class DatabaseError extends AppError {
  readonly statusCode = ERROR_CODES.DATABASE_ERROR;
  readonly httpStatus = 500;
  readonly isOperational = false;

  constructor(message = 'Database operation failed', cause?: Error) {
    super(message, cause?.message);
  }
}

// External API errors
export class ExternalAPIError extends AppError {
  readonly statusCode = ERROR_CODES.EXTERNAL_API_ERROR;
  readonly httpStatus = 502;
  readonly isOperational = true;

  constructor(service: string, message?: string) {
    super(message || `External service ${service} is unavailable`);
  }
}

// QR generation specific errors
export class QrGenerationError extends BusinessLogicError {
  constructor(message: string, details?: unknown) {
    super(message, 'QR_GENERATION_FAILED', details);
  }
}

// IBAN validation errors
export class IbanValidationError extends BusinessLogicError {
  constructor(iban: string) {
    super(`Invalid Slovak IBAN: ${iban}`, 'IBAN_VALIDATION_FAILED');
  }
}

// Profile errors
export class ProfileNotFoundError extends BusinessLogicError {
  constructor() {
    super('User profile not found', 'PROFILE_NOT_FOUND');
  }
}

// Subscription errors
export class SubscriptionRequiredError extends BusinessLogicError {
  constructor(feature: string) {
    super(
      `Subscription required for feature: ${feature}`,
      'SUBSCRIPTION_REQUIRED'
    );
  }
}

// Feature access errors
export class FeatureNotAvailableError extends BusinessLogicError {
  constructor(feature: string, requiredPlan: string) {
    super(
      `Feature '${feature}' requires ${requiredPlan} plan`,
      'FEATURE_NOT_AVAILABLE',
      { feature, requiredPlan }
    );
  }
}

// Internal server error class for generic errors
class InternalServerError extends AppError {
  readonly statusCode = ERROR_CODES.INTERNAL_ERROR;
  readonly httpStatus = 500;
  readonly isOperational = false;

  constructor(message = 'Internal server error') {
    super(message);
  }
}

// API error handler utility
export function handleApiError(error: unknown, path?: string): Response {
  console.error('API Error:', {
    error: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    path,
    timestamp: new Date().toISOString(),
  });

  // Handle known application errors
  if (error instanceof AppError) {
    return Response.json(
      {
        error: error.message,
        code: error.statusCode,
      },
      { status: error.httpStatus }
    );
  }

  // Handle validation errors
  if (error instanceof Error && error.name === 'ZodError') {
    return Response.json(
      {
        error: 'Validation failed',
        code: ERROR_CODES.VALIDATION_ERROR,
      },
      { status: 400 }
    );
  }

  // Default to internal server error
  return Response.json(
    {
      error: 'Internal server error',
      code: ERROR_CODES.INTERNAL_ERROR,
    },
    { status: 500 }
  );
}

// Success response utility
export function createSuccessResponse<T>(
  data: T,
  message = 'Success'
): { statusCode: string; message: string; data: T } {
  return {
    statusCode: ERROR_CODES.SUCCESS,
    message,
    data,
  };
}

export class AuthError extends Error {
  constructor(message = 'Authentication error') {
    super(message);
    this.name = 'AuthError';
  }
}

// Common error scenarios
export const QR_ERRORS = {
  INVALID_IBAN: 'INVALID_IBAN',
  // ... existing code ...
};
