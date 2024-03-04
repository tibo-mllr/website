import { type Project as NormalProject } from '@website/shared-types';
import { type OrganizationDocument } from 'organization';

export type Project = Omit<NormalProject, 'organization'> & {
  organization: OrganizationDocument;
};
export type ProjectDocument = Project & {
  _id: string;
  organization: OrganizationDocument;
};
