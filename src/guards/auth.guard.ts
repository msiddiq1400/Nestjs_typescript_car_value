import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const requst = context.switchToHttp().getRequest();
    return requst.session.userId;
  }
}
