import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Markup, Telegraf } from 'telegraf';
import { ISendNotification } from '@common/interfaces/telegram';
import { MarkdownHelper } from '../../common/helpers';

@Injectable()
export class NotificationBotService {
  constructor(
    @InjectBot()
    private readonly bot: Telegraf<Context>,
  ) {}

  private buildButtonsWithUrl(buttons: Array<[string, string]>) {
    const markupButtons = buttons.map(([title, url]) =>
      Markup.button.url(MarkdownHelper.escape(title), url),
    );

    return Markup.inlineKeyboard(markupButtons);
  }

  private buildMessage(data: Omit<ISendNotification, 'button'>) {
    const notificationTitle = MarkdownHelper.bold('Новое уведомление:');

    const titleMessage = MarkdownHelper.italic('Заголовок: ');
    const titleDescription = MarkdownHelper.bold(data.title);

    let message = `${notificationTitle}\n\n${titleMessage}${titleDescription}`;

    if (!_.isEmpty(data.details)) {
      const detailsMessage = MarkdownHelper.italic('Детали: ');
      const detailsDescription = data.details
        .map((detail) => {
          const key = MarkdownHelper.bold(detail[0]);
          const value = detail[1];

          return `${key}: ${value}`;
        })
        .join('\n');

      message += `\n\n${detailsMessage}\n${detailsDescription}`;
    }

    if (!_.isEmpty(data.jsonObject)) {
      const objectMessage = MarkdownHelper.italic('Обьект: ');

      const json = JSON.stringify(data.jsonObject, null, 2);
      const jsonMessage = MarkdownHelper.json(json);

      message += `\n\n${objectMessage}\n${jsonMessage}`;
    }

    return message;
  }

  private async updateVisitStatus(ctx: Context) {
    const message: string = _.get(ctx, [
      'update',
      'callback_query',
      'message',
      'text',
    ]);
    if (message) {
      const updatedMessage = message.replace('Выполнено: ❌', 'Выполнено: ✔');
      await ctx.editMessageText(updatedMessage);
    }
  }

  public async send(data: ISendNotification) {
    const extra = {
      parse_mode: 'MarkdownV2' as any,
      ...(_.isEmpty(data.buttons)
        ? {}
        : this.buildButtonsWithUrl(data.buttons)),
      ...(data.replyToMessage
        ? { reply_to_message_id: data.replyToMessage }
        : {}),
    };

    if (data.photo) {
      return await this.bot.telegram.sendPhoto(data.to, data.photo, {
        caption: this.buildMessage(data),
        ...extra,
      });
    } else if (data.fileBuffer) {
      return await this.bot.telegram.sendDocument(
        data.to,
        {
          source: data.fileBuffer.content,
          filename: data.fileBuffer.name,
        },
        {
          caption: this.buildMessage(data),
          ...extra,
        },
      );
    } else {
      return await this.bot.telegram.sendMessage(
        data.to,
        this.buildMessage(data),
        extra,
      );
    }
  }
}
