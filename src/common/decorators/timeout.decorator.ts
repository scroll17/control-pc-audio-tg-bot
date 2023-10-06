import { SetMetadata } from '@nestjs/common';

export const Timeout = (time: number) => SetMetadata('timeout', time);
