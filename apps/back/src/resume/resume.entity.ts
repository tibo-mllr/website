import { type ProjectType } from '@website/shared-types';
import { type ProjectDocument } from 'project/project.schema';

export class Resume {
  projects: {
    _id: ProjectType;
    projects: ProjectDocument[];
  }[];
  competencies: string[];
}
