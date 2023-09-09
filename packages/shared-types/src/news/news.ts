import { z } from 'zod';
import { frontUserSchema } from '../user';

export const newsSchema = z.object({
  title: z.string(),
  content: z.string(),
  date: z.date(),
  author: frontUserSchema.pick({ username: true }),
  edited: z.boolean().optional(),
  editor: frontUserSchema.pick({ username: true }).optional(),
});
export type News = z.infer<typeof newsSchema>;
