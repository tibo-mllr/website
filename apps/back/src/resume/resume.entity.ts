import { ProjectType } from '@website/shared-types';
import { ProjectDocument } from '../project/project.schema';

export class Resume {
  projects: {
    _id: ProjectType;
    projects: ProjectDocument[];
  }[];
  competencies: string[];
}
