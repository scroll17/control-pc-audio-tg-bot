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
import { Context, Telegraf, Markup } from 'telegraf';
import { BotService } from './bot.service';
import { TelegrafExceptionFilter } from '../common/filters';
import { Logger, UseFilters, UseInterceptors } from '@nestjs/common';
import { CurrentTelegramUser, TelegramAuth } from '../common/decorators';
import { TelegrafLoggingInterceptor } from '../common/interceptors';

// bot.hears('🔍 Search', ctx => ctx.reply('Yay!'))
// bot.hears('📢 Ads', ctx => ctx.reply('Free hugs. Call now!'))

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
    await ctx.reply('Control audio buttons keyboard', Markup
      .keyboard([
        ['⏪ Prev', '⏯️ Play/Pause', '⏩ Next'],
        ['🔽 Down vol', '🔼 Up vol'],
        ['🎵 Info']
      ])
      .persistent()
      .resize()
    )

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
      '/none - Ничего',
    ].join('\n');
    const description = [
      'Ничего',
    ].join('\n');

    return `${commands}\n\n${description}`;
  }

  @Command('/control')
  @TelegramAuth()
  async onTestCommand(@Ctx() ctx: Context) {
    return ctx.reply('Control audio buttons keyboard', Markup
      .keyboard([
        ['⏪ Prev', '⏯️ Play/Pause', '⏩ Next'],
        ['🔽 Down vol', '🔼 Up vol'],
        ['🎵 Info']
      ])
      .persistent()
      .resize()
    )
  }
}
