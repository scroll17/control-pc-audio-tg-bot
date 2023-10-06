import {CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Injectable()
export class TelegrafHasBotAccessGuard implements CanActivate {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const telegramContext =
      TelegrafExecutionContext.create(context).getContext<Context>();

    const userId = this.configService.getOrThrow('user.chatId');
    const messageUserId = telegramContext.update['message'].from.id;

    if (userId !== messageUserId) {
      this.logger.warn('Request from unknown user', {
        message: telegramContext.update['message']
      })
      throw new HttpException(`You haven't access`, HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
