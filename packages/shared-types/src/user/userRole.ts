import { nativeEnum } from 'zod';

export enum UserRole {
  Admin = 'Admin',
  SuperAdmin = 'superAdmin',
}
export const userRoleSchema = nativeEnum(UserRole);
