'use client';

import { useRouter } from 'next/navigation';
import { ReactElement, useEffect } from 'react';

import { API } from '@/lib/api';

export function ResumeWebSockets(): ReactElement {
  const router = useRouter();

  useEffect(() => {
    API.listenTo('projectAdded', router.refresh);
    API.listenTo('projectEdited', router.refresh);
    API.listenTo('projectDeleted', router.refresh);
    API.listenTo('projectsDeleted', router.refresh);

    return () => {
      API.stopListening('projectAdded');
      API.stopListening('projectEdited');
      API.stopListening('projectDeleted');
      API.stopListening('projectsDeleted');
    };
  }, [router.refresh]);

  return <></>;
}
