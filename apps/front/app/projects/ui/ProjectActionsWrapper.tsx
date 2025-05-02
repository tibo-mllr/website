'use client';

import dynamic from 'next/dynamic';
import { ReactElement } from 'react';

import { ProjectDocument } from '@/lib/utils';

const ProjectActions = dynamic(() => import('./ProjectActions'), {
  ssr: false,
});

type ProjectActionsWrapperProps = {
  project: ProjectDocument;
};

export function ProjectActionsWrapper({
  project,
}: ProjectActionsWrapperProps): ReactElement {
  return <ProjectActions project={project} />;
}
