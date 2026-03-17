import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AppLoggerService } from '../logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: AppLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    return next.handle().pipe(
      tap(async (data) => {
        const response = ctx.getResponse();
        await this.loggerService.logRequest({
          method: request.method,
          url: request.url,
          headers: request.headers,
          requestBody: request.body,
          responseBody: data,
          statusCode: response.statusCode,
          userId: request.user?.sub,
          ipAddress: request.ip,
          executionTime: Date.now() - now,
        });
      }),
      catchError((err) => {
        // Derive HTTP status & error payload similar to HttpExceptionFilter
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errorPayload: any = err;

        if (err instanceof HttpException) {
          status = err.getStatus();
          const res = err.getResponse() as any;
          message = (res && (res.message || res.error)) || err.message;
          errorPayload = typeof res === 'string' ? { message: res } : res;
        } else if ((err as any).name === 'ValidationError') {
          status = HttpStatus.BAD_REQUEST;
          message = 'Validation failed';
        } else if ((err as any).name === 'MongoError') {
          status = HttpStatus.BAD_REQUEST;
          message = 'Database error';
        } else if ((err as any).name === 'JsonWebTokenError') {
          status = HttpStatus.UNAUTHORIZED;
          message = 'Invalid token';
        }

        const responseBody = {
          success: false,
          message,
          error: errorPayload,
          path: request.url,
          timestamp: new Date().toISOString(),
        };

        void this.loggerService.logRequest({
          method: request.method,
          url: request.url,
          headers: request.headers,
          requestBody: request.body,
          responseBody,
          statusCode: status,
          error: {
            message: err.message,
            stack: err.stack,
          },
          userId: request.user?.sub,
          ipAddress: request.ip,
          executionTime: Date.now() - now,
        });

        return throwError(() => err);
      }),
    );
  }
}

