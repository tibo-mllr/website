import { type ProjectType } from '@website/shared-types';

import { type ProjectDocument } from 'project/project.schema';

export type AggregatedProject = {
  _id: ProjectType;
  projects: ProjectDocument[];
};

export class Resume {
  projects: AggregatedProject[];
  competencies: string[];
}
