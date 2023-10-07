import {ArgumentsHost, Catch, ExceptionFilter, Logger} from '@nestjs/common';
import { TelegrafArgumentsHost } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Catch()
export class TelegrafExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(this.constructor.name);

  async catch(exception: Error, host: ArgumentsHost): Promise<void> {
    this.logger.error('Catch exception', exception)

    const telegrafHost = TelegrafArgumentsHost.create(host);
    const ctx = telegrafHost.getContext<Context>();

    await ctx.replyWithHTML(`<b>Error</b>: ${exception.message}`);
  }
}
