import {
  Injectable,
  SetMetadata,
  type CanActivate,
  type CustomDecorator,
  type ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { type UserRole } from '@website/shared-types';

export const Roles = (...roles: UserRole[]): CustomDecorator<'role'> => {
  return SetMetadata('role', roles);
};

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get<UserRole[]>('role', context.getHandler());
    if (!role) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return role[0] === user.role;
  }
}
