/*external modules*/
import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeHelper {
  sleep(time: number): Promise<void> {
    return new Promise((resolve) => {
      return setTimeout(resolve, time);
    });
  }
}
