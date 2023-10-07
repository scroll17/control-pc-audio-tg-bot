import {
  Command,
  Ctx, Hears,
  Help,
  InjectBot,
  Next,
  Start,
  Update,
} from 'nestjs-telegraf';
import {Context, Telegraf} from 'telegraf';
import { BotService } from './bot.service';
import { TelegrafExceptionFilter } from '../common/filters';
import { Logger, UseFilters, UseInterceptors } from '@nestjs/common';
import { TelegramAuth } from '../common/decorators';
import { TelegrafLoggingInterceptor } from '../common/interceptors';
import {KeyboardItems} from "../common/enums";

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
    await ctx.reply('Control audio buttons keyboard', this.botService.buildKeyboardMarkup())
    return `Бот запущен`;
  }

  // @On('message')
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
  async onControlCommand(@Ctx() ctx: Context) {
    await ctx.reply('Control audio buttons keyboard', this.botService.buildKeyboardMarkup())
  }

  @Command('/inline')
  @TelegramAuth()
  async onInlineCommand(@Ctx() ctx: Context) {
    await ctx.reply('Control audio buttons inline keyboard', this.botService.buildInlineKeyboardMarkup())
  }

  @Hears(KeyboardItems.Prev)
  @TelegramAuth()
  async prevAudio(@Ctx() ctx: Context) {
    await this.botService.prevAudio();

    const info = await this.botService.getAudioInfo();
    await ctx.replyWithMarkdownV2(info)
  }

  @Hears(KeyboardItems.Toggle)
  @TelegramAuth()
  async toggleAudio(@Ctx() ctx: Context) {
    await this.botService.toggleAudio()
  }

  @Hears(KeyboardItems.Next)
  @TelegramAuth()
  async nextAudio(@Ctx() ctx: Context) {
    await this.botService.nextAudio()

    const info = await this.botService.getAudioInfo();
    await ctx.replyWithMarkdownV2(info)
  }

  @Hears(KeyboardItems.Info)
  @TelegramAuth()
  async infoAudio(@Ctx() ctx: Context) {
    const info = await this.botService.getAudioInfo()
    await ctx.replyWithMarkdownV2(info)
  }
}
