import { auth } from '@/lib/auth';
import {
  DEFAULT_SERVER_ERROR_MESSAGE,
  createSafeActionClient,
} from 'next-safe-action';
import { headers } from 'next/headers';
import { z } from 'zod';
import { ERROR_CODES } from './errors';
import { checkUserUsageLimit } from './rate-limiting';

// Custom error classes for better error handling
export class ActionError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = 'ActionError';
    this.code = code;
  }
}

export class RateLimitExceededError extends ActionError {
  usageDetails?: unknown;

  constructor(message: string, usageDetails?: unknown) {
    super(message, ERROR_CODES.RATE_LIMIT_EXCEEDED);
    this.usageDetails = usageDetails;
  }
}

export class AuthenticationRequiredError extends ActionError {
  constructor() {
    super('Authentication required', ERROR_CODES.UNAUTHORIZED);
  }
}

export class FeatureNotAvailableError extends ActionError {
  constructor(feature: string, requiredPlan: string) {
    super(
      `Feature '${feature}' requires ${requiredPlan} plan`,
      ERROR_CODES.FEATURE_NOT_AVAILABLE
    );
  }
}

class AuthError extends Error {
  constructor(message = 'User not authenticated') {
    super(message);
    this.name = 'AuthError';
  }
}

const handleServerError = (e: Error) => {
  if (e instanceof AuthError) {
    return e.message;
  }
  // For other errors, you might want to log them and return a generic message.
  console.error('Server Action Error:', e);
  return 'An unexpected error occurred.';
};

const baseClient = createSafeActionClient({
  handleServerError(e: Error) {
    return handleServerError(e);
  },
});

export const action = baseClient;

export const protectedAction = baseClient.use(async ({ next }: any) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new AuthError('Authentication required');
  }

  return next({
    ctx: {
      user: session.user,
      userId: session.user.id,
    },
  });
});

// Base action client with error handling
export const actionClient = createSafeActionClient({
  // Define metadata schema for action names and features
  defineMetadataSchema: () =>
    z.object({
      actionName: z.string(),
      requiresAuth: z.boolean().default(false),
      requiredFeature: z.string().optional(),
    }),

  // Custom server error handler
  handleServerError: (error: Error, utils: any) => {
    const { metadata, ctx } = utils;

    // Log error for monitoring
    console.error('Action Error:', {
      error: error.message,
      stack: error.stack,
      actionName: metadata?.actionName,
      userId:
        ctx && typeof ctx === 'object' && 'userId' in ctx
          ? ctx.userId
          : undefined,
      timestamp: new Date().toISOString(),
    });

    // Handle known action errors
    if (error instanceof ActionError) {
      return {
        message: error.message,
        code: error.code,
        statusCode: getHttpStatusFromErrorCode(error.code),
      };
    }

    // Handle rate limit errors specifically
    if (error instanceof RateLimitExceededError) {
      return {
        message: error.message,
        code: error.code,
        statusCode: 429,
        details: error.usageDetails,
      };
    }

    // Mask other errors
    return {
      message: DEFAULT_SERVER_ERROR_MESSAGE,
      code: ERROR_CODES.INTERNAL_ERROR,
      statusCode: 500,
    };
  },
});

// Authentication middleware
export const authActionClient = actionClient.use(
  async ({ next, metadata }: any) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id;

    // Check if action requires authentication
    if (metadata?.requiresAuth && !userId) {
      throw new AuthenticationRequiredError();
    }

    // If user is authenticated, check rate limits
    if (userId) {
      try {
        const usageStatus = await checkUserUsageLimit();

        return next({
          ctx: {
            userId,
            usageStatus,
          },
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('limit exceeded')
        ) {
          throw new RateLimitExceededError(error.message);
        }
        throw error;
      }
    }

    // For non-authenticated users, just pass empty context
    return next({
      ctx: {
        userId: null,
        usageStatus: null,
      },
    });
  }
);

// Anonymous action client for public actions
export const publicActionClient = actionClient.use(
  async ({ next, metadata }: any) => {
    // TODO: Implement IP-based rate limiting for anonymous users
    // For now, just log the attempt
    console.log('Anonymous action:', metadata?.actionName);

    return next({
      ctx: {
        userId: null,
        isAnonymous: true,
      },
    });
  }
);

// Helper function to map error codes to HTTP status codes
function getHttpStatusFromErrorCode(code?: string): number {
  switch (code) {
    case ERROR_CODES.UNAUTHORIZED:
      return 401;
    case ERROR_CODES.FORBIDDEN:
      return 403;
    case ERROR_CODES.NOT_FOUND:
      return 404;
    case ERROR_CODES.VALIDATION_ERROR:
      return 400;
    case ERROR_CODES.RATE_LIMIT_EXCEEDED:
      return 429;
    case ERROR_CODES.FEATURE_NOT_AVAILABLE:
      return 403;
    default:
      return 500;
  }
}

// Success response utility
export function createSuccessResponse<T>(data: T, message = 'Success') {
  return {
    success: true,
    message,
    data,
  };
}

// Export types for use in actions
export type AuthenticatedContext = {
  userId: string;
  usageStatus: Awaited<ReturnType<typeof checkUserUsageLimit>>;
};

export type PublicContext = {
  userId: null;
  isAnonymous: true;
};

export type SafeActionResult<T> = {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    message: string;
    code?: string;
    statusCode?: number;
    details?: unknown;
  };
};
