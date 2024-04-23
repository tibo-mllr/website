import { Metadata } from 'next';
import { type ReactElement, type ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Login',
};

export default function HLoginLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return <>{children}</>;
}
