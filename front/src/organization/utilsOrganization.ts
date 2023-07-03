export type Organization = {
  name: string;
  description: string;
  location: string;
  website: string;
};

export type OrganizationDocument = Organization & {
  _id: string;
};
