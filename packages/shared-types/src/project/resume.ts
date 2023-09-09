import { ProjectDocument, ProjectType } from './project';

export type Resume = {
  projects: {
    type: ProjectType;
    projects: ProjectDocument[];
  }[];
  competencies: string[];
};
