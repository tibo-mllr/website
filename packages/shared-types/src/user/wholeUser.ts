import { HydratedDocument } from 'mongoose';
import { z } from 'zod';

export enum UserRole {
  Admin,
  SuperAdmin,
}
export const userRoleSchema = z.nativeEnum(UserRole);

export const userSchema = z.object({
  role: userRoleSchema,
  username: z.string(),
  hashedPassword: z.string(),
});
export type User = z.infer<typeof userSchema>;

export type UserDocument = HydratedDocument<User>;
