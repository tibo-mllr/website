import { ProjectDocument, ProjectType } from '../project/project.schema';

export class Resume {
  projects: {
    _id: ProjectType;
    projects: ProjectDocument[];
  }[];
  competencies: string[];
}
