import { ProjectType } from '@website/shared-types';
import { ProjectDocument } from '../project/utilsProject';

export type Resume = {
  projects: { _id: ProjectType; projects: ProjectDocument[] }[];
  competencies: string[];
};
