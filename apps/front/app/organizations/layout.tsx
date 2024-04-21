import { Metadata } from 'next';
import { type ReactElement, type ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Organizations',
};

export default function OrganizationsLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return <>{children}</>;
}
