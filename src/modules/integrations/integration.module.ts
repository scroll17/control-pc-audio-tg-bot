/*external modules*/
import { Module } from '@nestjs/common';
/*services*/
import { IntegrationService } from './integration.service';
import {MacOSAudioController} from "./os/MacOSAudioController";
/*controllers*/
/*@entities*/

@Module({
  providers: [IntegrationService, MacOSAudioController],
  exports: [IntegrationService],
})
export class IntegrationModule {}
