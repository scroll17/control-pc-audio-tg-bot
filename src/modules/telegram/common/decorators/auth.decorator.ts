import { applyDecorators, UseGuards } from '@nestjs/common';
import { TelegrafHasBotAccessGuard } from '../guards';

export function TelegramAuth() {
  return applyDecorators(UseGuards(TelegrafHasBotAccessGuard));
}
