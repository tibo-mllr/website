import { type Project as NormalProject } from '@website/shared-types';
import { EnqueueSnackbar } from 'notistack';
import { client } from './utils';
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
  enqueueSnackbar: EnqueueSnackbar,
  organization?: OrganizationDocument,
): Promise<string | undefined> => {
  if (!organization) return undefined;

  if (!organization._id) {
    const organizationToPost: Partial<OrganizationDocument> = organization;
    delete organizationToPost._id;

    return client
      .post<OrganizationDocument>('/organization', organizationToPost)
      .then(({ data: { _id } }) => _id)
      .catch((error) => {
        enqueueSnackbar(error, { variant: 'error' });
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
    return client
      .put<OrganizationDocument>(
        '/organization/' + organization._id,
        organization,
      )
      .then(({ data: { _id } }) => _id)
      .catch((error) => {
        enqueueSnackbar(error, { variant: 'error' });
        console.error(error);
        throw error;
      });
  }

  return organization._id;
};
