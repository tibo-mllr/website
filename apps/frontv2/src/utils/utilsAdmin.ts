import { type FrontUser } from '@website/shared-types';

export type FrontUserDocument = FrontUser & {
  _id: string;
};
