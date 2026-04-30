import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.util';
import { ZodError } from 'zod';

interface ErrorResponse {
  status: 'error';
  message: string;
  errors?: unknown;
  stack?: string;
}

export const errorMiddleware = (
  err: Error | AppError | ZodError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: unknown = undefined;

  // Handle operational errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Handle Zod validation errors
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    errors = err.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  }

  // Handle Prisma errors
  else if (err.constructor.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as unknown as { code: string; meta?: { target?: string[] } };
    statusCode = 400;

    if (prismaError.code === 'P2002') {
      const target = prismaError.meta?.target?.[0] || 'field';
      message = `${target} already exists`;
    } else if (prismaError.code === 'P2025') {
      statusCode = 404;
      message = 'Record not found';
    } else {
      message = 'Database error';
    }
  }

  // Log error for debugging
  if (statusCode >= 500) {
    // eslint-disable-next-line no-console
    console.error('Error:', err);
  }

  const response: ErrorResponse = {
    status: 'error',
    message,
    ...(errors ? { errors } : {}),
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  };

  res.status(statusCode).json(response);
};
