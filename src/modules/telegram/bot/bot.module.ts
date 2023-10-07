import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { BotService } from './bot.service';
import { NotificationBotService } from './notification/notification.service';
import {IntegrationModule} from "../../integrations/integration.module";

@Module({
  imports: [IntegrationModule],
  providers: [BotService, BotUpdate, NotificationBotService],
  exports: [BotService, NotificationBotService],
})
export class BotModule {}
