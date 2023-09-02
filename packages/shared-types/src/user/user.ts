import { z } from 'zod';

export enum UserRole {
  Admin,
  SuperAdmin,
}
export const userRoleSchema = z.nativeEnum(UserRole);

export const userSchema = z.object({
  role: userRoleSchema,
  username: z.string(),
  password: z.string(),
});
export type User = z.infer<typeof userSchema>;

export const userDocumentSchema = userSchema.merge(
  z.object({
    _id: z.string(),
  }),
);
export type UserDocument = z.infer<typeof userDocumentSchema>;
