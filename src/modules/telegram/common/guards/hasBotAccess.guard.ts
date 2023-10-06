import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Injectable()
export class TelegrafHasBotAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const telegramContext =
      TelegrafExecutionContext.create(context).getContext<Context>();

    return true;
    // const user = await this.userService.getByTelegram(
    //   telegramContext.update['message'].from.id,
    // );
    // if (!user) {
    //   throw new Error(`You haven't access`);
    // }
    //
    // return user.hasBotAccess;
  }
}
