import {
  PartialBy,
  type Project as NormalProject,
} from '@website/shared-types';

import { Notify } from '@/components';

import { API } from '../api';

import { type OrganizationDocument } from './utilsOrganization';

export type Project = Omit<NormalProject, 'organization'> & {
  organization: OrganizationDocument;
};

export type ProjectDocument = Omit<Project, 'organization'> & {
  _id: string;
  organization?: OrganizationDocument;
};

export const handleOrganization = async (
  organizations: OrganizationDocument[],
  notify: Notify,
  organization?: OrganizationDocument,
): Promise<string | undefined> => {
  if (!organization) return undefined;

  if (!organization._id) {
    const organizationToPost: PartialBy<OrganizationDocument, '_id'> =
      organization;
    delete organizationToPost._id;

    return API.createOrganization(organizationToPost)
      .then(({ _id }) => _id)
      .catch((error) => {
        notify(error, { severity: 'error' });
        console.error(error);
        throw error;
      });
  }

  const organizationToCheck = organizations.find(
    (organization) => organization._id === organization._id,
  );
  if (
    organizationToCheck?.name !== organization.name ||
    organizationToCheck?.description !== organization.description ||
    organizationToCheck?.location !== organization.location ||
    organizationToCheck?.website !== organization.website
  ) {
    return API.editOrganization(organization._id, organization)
      .then(({ _id }) => _id)
      .catch((error) => {
        notify(error, { severity: 'error' });
        console.error(error);
        throw error;
      });
  }

  return organization._id;
};
