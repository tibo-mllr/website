'use client';

import { useRouter } from 'next/navigation';
import { ReactElement, useEffect } from 'react';

import { API } from '@/lib/api';

export function OrganizationWebSockets(): ReactElement {
  const router = useRouter();

  useEffect(() => {
    API.listenTo('organizationAdded', router.refresh);
    API.listenTo('organizationEdited', router.refresh);
    API.listenTo('organizationDeleted', router.refresh);
    return () => {
      API.stopListening('organizationAdded');
      API.stopListening('organizationEdited');
      API.stopListening('organizationDeleted');
    };
  }, [router.refresh]);

  return <></>;
}
