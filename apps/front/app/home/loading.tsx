import { ReactElement } from 'react';

import { NewsCardSkeleton } from './ui';

export default function Loading(): ReactElement {
  return (
    <>
      <NewsCardSkeleton />
      <NewsCardSkeleton />
      <NewsCardSkeleton />
    </>
  );
}
