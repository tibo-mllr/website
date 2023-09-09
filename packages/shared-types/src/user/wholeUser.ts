import { z } from 'zod';

export enum UserRole {
  Admin = 'Admin',
  SuperAdmin = 'superAdmin',
}
export const userRoleSchema = z.nativeEnum(UserRole);

export const userSchema = z.object({
  role: userRoleSchema,
  username: z.string(),
  hashedPassword: z.string(),
});
export type User = z.infer<typeof userSchema>;
