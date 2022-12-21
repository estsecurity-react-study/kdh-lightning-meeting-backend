import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Observable } from 'rxjs';

import { SessionInterface } from '../../session/interfaces/session.interface';

@Injectable()
export class CookieAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const session = request.session as SessionInterface;
    return !!session.userId;
  }
}
