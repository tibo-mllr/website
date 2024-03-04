import { type News } from '@website/shared-types';

export type NewsDocument = News & {
  _id: string;
};
