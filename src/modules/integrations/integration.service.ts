/*external modules*/
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/*modules*/
/*adapters*/
/*providers*/
/*common*/
/*libs*/
/*db*/
/*other*/

@Injectable()
export class IntegrationService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private configService: ConfigService) {}
}
