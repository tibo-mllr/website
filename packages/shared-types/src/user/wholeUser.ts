import { z } from 'zod';

import { userRoleSchema } from './userRole';

export const userSchema = z.object({
  role: userRoleSchema,
  username: z.string(),
  hashedPassword: z.string(),
});
export type User = z.infer<typeof userSchema>;
