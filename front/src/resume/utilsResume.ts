import { ProjectDocument, ProjectType } from '../project/utilsProject';

export type Resume = {
  projects: { _id: ProjectType; projects: ProjectDocument[] }[];
  competencies: string[];
};
