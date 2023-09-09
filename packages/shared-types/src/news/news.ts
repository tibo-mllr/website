import { HydratedDocument } from 'mongoose';
import { z } from 'zod';
import { frontUserSchema } from '../user';

export const newsSchema = z.object({
  title: z.string(),
  content: z.string(),
  date: z.date(),
  author: frontUserSchema.omit({ password: true }),
  edited: z.boolean().optional(),
  editor: frontUserSchema.omit({ password: true }).optional(),
});
export type News = z.infer<typeof newsSchema>;

export type NewsDocument = HydratedDocument<News>;
