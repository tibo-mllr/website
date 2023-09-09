import { z } from 'zod';

export enum UserRole {
  Admin = 'Admin',
  SuperAdmin = 'superAdmin',
}
export const userRoleSchema = z.nativeEnum(UserRole);
