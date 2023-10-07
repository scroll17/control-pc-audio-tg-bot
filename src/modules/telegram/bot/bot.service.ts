import {Injectable, Logger} from '@nestjs/common';
import {Markup} from "telegraf";
import {KeyboardItems} from "../common/enums";
import {IntegrationService} from "../../integrations/integration.service";
import {MarkdownHelper} from "../common/helpers";

@Injectable()
export class BotService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly integrationService: IntegrationService
  ) {}

  private getKeyboardItems() {
    return [
      [KeyboardItems.Prev, KeyboardItems.Toggle, KeyboardItems.Next],
      [KeyboardItems.DownVol, KeyboardItems.UpVol],
      [KeyboardItems.Info]
    ]
  }

  public buildKeyboardMarkup() {
    return Markup
      .keyboard(this.getKeyboardItems())
      .persistent()
      .resize()
  }

  public buildInlineKeyboardMarkup() {
    return Markup
      .inlineKeyboard(
        this
          .getKeyboardItems()
          .map((items) => {
            return items.map(item => Markup.button.callback(item, item))
          })
        )
  }

  public async prevAudio() {
    this.logger.debug('Keyboard event', {
      event: KeyboardItems.Prev
    });
    
    await this.integrationService.prev();
  }

  public async toggleAudio() {
    this.logger.debug('Keyboard event', {
      event: KeyboardItems.Toggle
    });
    
    await this.integrationService.togglePlayPause();
  }

  public async nextAudio() {
    this.logger.debug('Keyboard event', {
      event: KeyboardItems.Next
    });
    
    await this.integrationService.next();
  }

  public async getAudioInfo() {
    this.logger.debug('Keyboard event', {
      event: KeyboardItems.Info
    });

    const info = await this.integrationService.getInfo();
    this.logger.debug('Song info', info)

    return Object.entries(info)
      .map((detail) => {
        const key = MarkdownHelper.bold(detail[0]);
        const value = MarkdownHelper.escape(detail[1] as string)

        return `${key}: ${value}`;
      })
      .join('\n');
  }
}
