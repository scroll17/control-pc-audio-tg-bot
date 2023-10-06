import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BotModule } from './bot/bot.module';
import { IntegrationModule } from "../integrations/integration.module";

@Module({
  imports: [
    BotModule,
    IntegrationModule,
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: function (configService: ConfigService) {
        this.botName = configService.get('telegram.botName');

        return {
          token: configService.get('telegram.token'),
          include: [BotModule],
        };
      },
    }),
  ],
  exports: [BotModule],
})
export class TelegramModule {}
