/*external modules*/
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
/*@common*/
import { EndpointDisabledGuard } from '../guards';

export function DisableEndpoint() {
  return applyDecorators(
    SetMetadata('isDisable', true),
    UseGuards(EndpointDisabledGuard),
  );
}
