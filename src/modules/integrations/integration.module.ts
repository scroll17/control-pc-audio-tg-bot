/*external modules*/
import { Module } from '@nestjs/common';
/*services*/
import { IntegrationService } from './integration.service';
/*controllers*/
/*@entities*/

@Module({
  providers: [IntegrationService],
  exports: [IntegrationService],
})
export class IntegrationModule {}
