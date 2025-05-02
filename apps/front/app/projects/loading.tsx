import { ReactElement } from 'react';

import { ProjectCardSkeleton } from './ui';

export default function Laoding(): ReactElement {
  return (
    <>
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
    </>
  );
}
