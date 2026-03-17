import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MESSAGES } from '../constants/messages';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = MESSAGES.COMMON.INTERNAL_ERROR;
    let error: any = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;
      message = (res && (res.message || res.error)) || exception.message;
      error = typeof res === 'string' ? { message: res } : res;
    } else if ((exception as any).name === 'ValidationError') {
      status = HttpStatus.BAD_REQUEST;
      message = MESSAGES.COMMON.VALIDATION_FAILED;
      error = exception;
    } else if ((exception as any).name === 'MongoError') {
      status = HttpStatus.BAD_REQUEST;
      message = 'Database error';
      error = exception;
    } else if ((exception as any).name === 'JsonWebTokenError') {
      status = HttpStatus.UNAUTHORIZED;
      message = 'Invalid token';
      error = exception;
    } else {
      error = exception;
    }

    response.status(status).json({
      success: false,
      message,
      error,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}

