import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, timeout, TimeoutError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const time = this.reflector.get<number>('timeout', context.getHandler());
    if (!time) {
      return throwError(
        () =>
          new HttpException(
            'Invalid using of Timeout Interceptor',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
      );
    }

    return next.handle().pipe(
      timeout(time),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }

        return throwError(() => err);
      }),
    );
  }
}
