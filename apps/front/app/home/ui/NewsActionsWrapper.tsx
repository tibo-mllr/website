'use client';

import dynamic from 'next/dynamic';
import { ReactElement } from 'react';

import { NewsDocument } from '@/lib/utils';

const NewsActionsInside = dynamic(() => import('./NewsActions'), {
  ssr: false,
});

type NewsActionsWrapperProps = {
  news: NewsDocument;
};

export function NewsActionsWrapper({
  news,
}: NewsActionsWrapperProps): ReactElement {
  return <NewsActionsInside news={news} />;
}
