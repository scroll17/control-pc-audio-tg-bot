import {
  Command,
  Ctx,
  Help,
  InjectBot,
  Next,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { BotService } from './bot.service';
import { TelegrafExceptionFilter } from '../common/filters';
import { Logger, UseFilters, UseInterceptors } from '@nestjs/common';
import { CurrentTelegramUser, TelegramAuth } from '../common/decorators';
import { TelegrafLoggingInterceptor } from '../common/interceptors';

@Update()
@UseInterceptors(TelegrafLoggingInterceptor)
@UseFilters(TelegrafExceptionFilter)
export class BotUpdate {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectBot()
    private readonly bot: Telegraf<Context>,
    private readonly botService: BotService,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context): Promise<string> {
    return `Бот запущен`;
  }

  @On('message')
  async onMessage(@Ctx() ctx: Context, @Next() next): Promise<void> {
    const message = ctx.update['message'];
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

    return next();
  }

  @Help()
  @TelegramAuth()
  async onHelp(): Promise<string> {
    const commands = [
      '/get_auth_token - Получить токен аутентификации',
      '/get_client_url - Получить URL клиента',
      '/get_server_url - Получить URL сервера',
    ].join('\n');
    const description = [
      'URL клиента это ссылка на CRM сайт',
      'Токен аутентификации используеться на стороне клиента',
      'URL сервера также используеться на стороне клиента',
    ].join('\n');

    return `${commands}\n\n${description}`;
  }

  @Command('get_auth_token')
  @TelegramAuth()
  async onGetAuthTokenCommand(
    @CurrentTelegramUser() tgUser: any,
    @Ctx() ctx: Context,
  ): Promise<void> {
    await ctx.replyWithMarkdown('none');
  }

  @Command('get_server_url')
  @TelegramAuth()
  async onGetServerUrlCommand(@Ctx() ctx: Context): Promise<void> {
    // const message = await this.botService.getServerUrl();
    // await ctx.replyWithMarkdown(message);
  }
}
