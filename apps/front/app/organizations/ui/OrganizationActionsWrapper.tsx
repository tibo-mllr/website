'use client';

import dynamic from 'next/dynamic';
import { ReactElement } from 'react';

import { OrganizationDocument } from '@/lib/utils';

const OrganizationActions = dynamic(() => import('./OrganizationActions'), {
  ssr: false,
});

type OrganizationActionsWrapperProps = {
  organization: OrganizationDocument;
};

export function OrganizationActionsWrapper({
  organization,
}: OrganizationActionsWrapperProps): ReactElement {
  return <OrganizationActions organization={organization} />;
}
