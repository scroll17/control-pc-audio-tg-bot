/*external modules*/
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/*modules*/
/*adapters*/
/*providers*/
import {MacOSAudioController} from "./os/MacOSAudioController";
/*common*/
/*libs*/
/*db*/
/*other*/

@Injectable()
export class IntegrationService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly macOSAudioController: MacOSAudioController
  ) {
    // TODO: add abstraction for each OS
  }

  public async play() {
    await this.macOSAudioController.play()
  }

  public async pause() {
    await this.macOSAudioController.pause()
  }

  public async togglePlayPause() {
    await this.macOSAudioController.togglePlayPause()
  }

  public async next() {
    await this.macOSAudioController.next()
  }

  public async prev() {
    await this.macOSAudioController.prev()
  }

  public async getInfo(): Promise<Record<string, unknown>> {
    return this.macOSAudioController.getInfo()
  }
}
