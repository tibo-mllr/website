import { z } from 'zod';
import { userDocumentSchema, userSchema } from '../user';

export const newsSchema = z.object({
  title: z.string(),
  content: z.string(),
  date: z.date(),
  author: userSchema,
  edited: z.boolean().optional(),
  editor: userSchema.optional(),
});
export type News = z.infer<typeof newsSchema>;

export const newsDocumentSchema = newsSchema.extend({
  _id: z.string(),
  author: userDocumentSchema,
  editor: userDocumentSchema.optional(),
});

export type NewsDocument = z.infer<typeof newsDocumentSchema>;
