import {Injectable, Logger} from '@nestjs/common';

@Injectable()
export class BotService {
  private readonly logger = new Logger(this.constructor.name);

  constructor() {}

  public async getServerUrl() {

  }
}
