import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import {tap} from "rxjs/operators";

@Injectable()
export class TelegrafLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(this.constructor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const telegramContext =
      TelegrafExecutionContext.create(context).getContext();
    const message = telegramContext.update['message'];

    this.logger.log('Telegram Bot Message:', {
      from: {
        id: message.from.id,
        firstName: message.from.first_name,
        username: message.from.username,
      },
      data: {
        text: message.text,
      },
    });

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => this.logger.debug(`Execution time: ${Date.now() - now}ms`)),
      );
  }
}
