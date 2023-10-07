/*external modules*/
import * as childProcess from 'child_process';
import * as path from 'path';
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
export class MacOSAudioController {
  private readonly logger = new Logger(this.constructor.name);

  private readonly binFolderPath = path.join(__dirname, '../../../../', 'bin');
  private readonly AUDIO_INFO_OPTIONS = {
    artist: 'artist',
    album: 'album',
    title: 'title',
    duration: 'duration',
    // elapsedTime: 'elapsedTime',
  }

  constructor(private configService: ConfigService) {}

  private async runShellCommand(command: string) {
    const cliToolName = this.configService.getOrThrow('macos.cliToolName');

    return new Promise((res, rej) => {
      childProcess.exec(
        `./${cliToolName} ${command}`,
        {
          cwd: this.binFolderPath,
          encoding: 'utf8'
        },
        (error, stdout, stderr) => {
          if(error) {
            return rej({
              stack: error.stack,
              code: +error.code,
              signal: +error.signal
            })
          }

          if(stderr) return rej(stderr);

          res(stdout);
        }
      )
    })
  }

  private buildInfoOptions() {
    return Object.keys(this.AUDIO_INFO_OPTIONS).join(' ')
  }

  private parseInfo(infoStr: string) {
    const rawInfo = infoStr.split('\n')
    return Object
      .fromEntries(
        Object
          .keys(this.AUDIO_INFO_OPTIONS)
          .map((key, index) => {
            if(key === 'duration') {
              return [
                key,
                this.formatTime(parseFloat(rawInfo[index]))
              ]
            }

            return [key, rawInfo[index]]
          })
          .filter(([_, val]) => Boolean(val))
      )
  }

  private formatTime(s: number) {
    const time = (s-(s%=60))/60+(9<s?':':':0')+s;
    return time.slice(0, time.indexOf('.'))
  }

  public async play() {
    await this.runShellCommand('play');
  }

  public async pause() {
    await this.runShellCommand('pause');
  }

  public async togglePlayPause() {
    await this.runShellCommand('togglePlayPause');
  }

  public async next() {
    await this.runShellCommand('next');
  }

  public async prev() {
    await this.runShellCommand('previous');
  }

  public async getInfo() {
    const result = await this.runShellCommand(`get ${this.buildInfoOptions()}`);
    return this.parseInfo(result as string);
  }
}
