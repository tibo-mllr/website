import { z } from 'zod';
import { projectDocumentSchema, projectTypeSchema } from './project';

export const resumeSchema = z.object({
  projects: z.array(
    z.object({
      type: projectTypeSchema,
      projects: z.array(projectDocumentSchema),
    }),
  ),
  competencies: z.array(z.string()),
});
export type Resume = z.infer<typeof resumeSchema>;
