import { nativeEnum } from 'zod';

export enum UserRole {
  Admin = 'admin',
  SuperAdmin = 'superAdmin',
}
export const userRoleSchema = nativeEnum(UserRole);
