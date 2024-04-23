import { Metadata } from 'next';
import { type ReactElement, type ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Home',
};

export default function HomeLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return <>{children}</>;
}
