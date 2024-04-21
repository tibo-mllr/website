import { Metadata } from 'next';
import { type ReactElement, type ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Projects',
};

export default function ProjectLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return <>{children}</>;
}
