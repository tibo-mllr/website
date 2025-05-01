'use client';

import { useRouter } from 'next/navigation';
import { ReactElement, useEffect } from 'react';

import { API } from '@/lib/api';

export function ProjectWebSockets(): ReactElement {
  const router = useRouter();

  useEffect(() => {
    API.listenTo('projectAdded', router.refresh);
    API.listenTo('projectEdited', router.refresh);
    API.listenTo('projectDeleted', router.refresh);
    // Several projects deleted by cascade with an organization
    API.listenTo('projectsDeleted', router.refresh);
    // Calls that can be made for the creation/edition of a project
    API.listenTo('organizationAdded', router.refresh);
    API.listenTo('organizationEdited', router.refresh);
    API.listenTo('organizationDeleted', router.refresh);

    return () => {
      API.stopListening('projectAdded');
      API.stopListening('projectEdited');
      API.stopListening('projectDeleted');
      API.stopListening('projectsDeleted');
      API.stopListening('organizationAdded');
      API.stopListening('organizationEdited');
      API.stopListening('organizationDeleted');
    };
  }, [router.refresh]);

  return <></>;
}
