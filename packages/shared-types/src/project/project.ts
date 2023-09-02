import { z } from 'zod';
import {
  organizationDocumentSchema,
  organizationSchema,
} from '../organization';

export enum ProjectType {
  Education,
  TechExperiences = 'Tech Experiences',
  PersonalProjects = 'Personal Projects',
}
export const projectTypeSchema = z.nativeEnum(ProjectType);

export const projectSchema = z.object({
  role: z.string(),
  title: z.string(),
  organization: organizationSchema,
  type: projectTypeSchema,
  startDate: z.date(),
  endDate: z.date().optional(),
  description: z.string(),
  link: z.string().url().optional(),
  competencies: z.array(z.string()),
});
export type Project = z.infer<typeof projectSchema>;

export const projectDocumentSchema = projectSchema.extend({
  _id: z.string(),
  organization: organizationDocumentSchema,
});
export type ProjectDocument = z.infer<typeof projectDocumentSchema>;
