import { ReactElement } from 'react';

import { OrganizationCardSkeleton } from './ui';

export default function Loading(): ReactElement {
  return (
    <>
      <OrganizationCardSkeleton />
      <OrganizationCardSkeleton />
    </>
  );
}
