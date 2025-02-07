import { type ProjectType } from '@website/shared-types';

import { type ProjectDocument } from './utilsProject';

export type Resume = {
  projects: { _id: ProjectType; projects: ProjectDocument[] }[];
  competencies: string[];
};
