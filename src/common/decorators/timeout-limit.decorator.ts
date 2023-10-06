import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { Timeout } from './timeout.decorator';
import { TimeoutInterceptor } from '../interceptors';

export function TimeoutLimit(time: number) {
  return applyDecorators(Timeout(time), UseInterceptors(TimeoutInterceptor));
}
