import { z } from 'zod';
import { organizationSchema } from '../organization';

export enum ProjectType {
  Education = 'Education',
  TechExperiences = 'Tech Experiences',
  PersonalProjects = 'Personal Projects',
}
export const projectTypeSchema = z.nativeEnum(ProjectType);

export const projectSchema = z.object({
  role: z.string(),
  title: z.string(),
  organization: organizationSchema.optional(),
  type: projectTypeSchema,
  startDate: z.date(),
  endDate: z.date().optional(),
  description: z.string(),
  link: z.string().url().optional(),
  competencies: z.string().array().min(1),
});
export type Project = z.infer<typeof projectSchema>;
