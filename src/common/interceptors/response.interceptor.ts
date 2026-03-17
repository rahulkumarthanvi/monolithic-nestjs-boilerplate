import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiSuccessResponse } from '../responses/api-response.interface';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiSuccessResponse> {
    return next.handle().pipe(
      map((data: any) => {
        if (data && data.success !== undefined) {
          return data;
        }

        const { message, meta, ...rest } = data || {};

        return {
          success: true,
          message: message ?? 'Success',
          data: rest.data ?? rest,
          meta,
        };
      }),
    );
  }
}

