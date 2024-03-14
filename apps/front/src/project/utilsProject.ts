import { type Project as NormalProject } from '@website/shared-types';
import { type OrganizationDocument } from 'organization';
import { client } from 'utils';

export type Project = Omit<NormalProject, 'organization'> & {
  organization: OrganizationDocument;
};

export type ProjectDocument = Omit<Project, 'organization'> & {
  _id: string;
  organization?: OrganizationDocument;
};

export const handleOrganization = async (
  organizations: OrganizationDocument[],
  organization?: OrganizationDocument,
  token?: string,
): Promise<string | undefined> => {
  if (!organization) return undefined;

  if (!organization._id) {
    const organizationToPost: Partial<OrganizationDocument> = organization;
    delete organizationToPost._id;

    try {
      const {
        data: { _id },
      } = await client.post<OrganizationDocument>(
        '/organization',
        organizationToPost,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return _id;
    } catch (error) {
      alert(error);
      console.error(error);
    }
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
    const {
      data: { _id },
    } = await client.put<OrganizationDocument>(
      '/organization/' + organization._id,
      organization,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return _id;
  }

  return organization._id;
};
