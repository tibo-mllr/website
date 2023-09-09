import { z } from 'zod';
import { userRoleSchema } from './wholeUser';

export const frontUserSchema = z.object({
  role: userRoleSchema,
  username: z.string(),
  password: z.string(),
});
export type FrontUser = z.infer<typeof frontUserSchema>;
