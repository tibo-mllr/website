import { OrganizationDocument } from '../organization/utilsOrganization';

export enum ProjectType {
  Education = 'Education',
  Tech = 'Tech Experiences',
  Personal = 'Personal Projects',
}

export type Project = {
  role: string;
  title: string;
  organization: OrganizationDocument;
  type: ProjectType;
  startDate: Date;
  endDate?: Date;
  description: string;
  link?: string;
  competencies: string[];
};

export type ProjectDocument = Project & {
  _id: string;
};
