'use client';

import { useRouter } from 'next/navigation';
import { ReactElement, useEffect } from 'react';

import { API } from '@/lib/api';

export function NewsWebSockets(): ReactElement {
  const router = useRouter();

  useEffect(() => {
    API.listenTo('newsAdded', router.refresh);
    API.listenTo('newsEdited', router.refresh);
    API.listenTo('newsDeleted', router.refresh);

    return () => {
      API.stopListening('newsAdded');
      API.stopListening('newsEdited');
      API.stopListening('newsDeleted');
      API.stopListening('severalNewsDeleted');
    };
  }, [router.refresh]);

  return <></>;
}
