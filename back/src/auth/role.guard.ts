import {
  CanActivate,
  CustomDecorator,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export enum Role {
  Admin = 'admin',
  SuperAdmin = 'superAdmin',
}

export const Roles = (...roles: Role[]): CustomDecorator<'role'> => {
  return SetMetadata('role', roles);
};

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get<Role[]>('role', context.getHandler());
    if (!role) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return role[0] === user.role;
  }
}
