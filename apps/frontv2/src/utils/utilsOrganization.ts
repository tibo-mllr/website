import { type Organization } from '@website/shared-types';

export type OrganizationDocument = Organization & {
  _id: string;
};
