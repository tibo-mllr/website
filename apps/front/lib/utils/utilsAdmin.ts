import { type FrontUser } from '@website/shared-types';

export type FrontUserDocument = Omit<FrontUser, 'password'> & {
  _id: string;
  password?: string;
};
