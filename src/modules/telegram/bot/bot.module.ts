import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { BotService } from './bot.service';
import { NotificationBotService } from './notification/notification.service';

@Module({
  imports: [],
  providers: [BotService, BotUpdate, NotificationBotService],
  exports: [BotService, NotificationBotService],
})
export class BotModule {}
