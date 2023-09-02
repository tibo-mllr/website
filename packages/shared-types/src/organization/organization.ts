import { z } from 'zod';

export const organizationSchema = z.object({
  name: z.string(),
  description: z.string(),
  location: z.string(),
  website: z.string().url(),
});
export type Organization = z.infer<typeof organizationSchema>;

export const organizationDocumentSchema = organizationSchema.merge(
  z.object({
    _id: z.string(),
  }),
);
export type OrganizationDocument = z.infer<typeof organizationDocumentSchema>;
