import { Metadata } from 'next';
import { ReactElement, ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Admin',
};

export default function Layout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return <>{children}</>;
}
