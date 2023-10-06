/*external modules*/
import _ from 'lodash';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class EndpointDisabledGuard implements CanActivate {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isDisabled = this.reflector.get<boolean>(
      'isDisable',
      context.getHandler(),
    );
    if (isDisabled) {
      const request = context.switchToHttp().getRequest();

      this.logger.debug('Request to disable endpoint', {
        headers: request.headers,
        route: _.omit(request.route, ['stack']),
        body: request.body,
        timestamp: new Date(),
      });

      throw new ForbiddenException('Forbidden.');
    }

    return true;
  }
}
