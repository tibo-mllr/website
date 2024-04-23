import { Metadata } from 'next';
import { type ReactElement, type ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Resume',
};

export default function ResumeLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return <>{children}</>;
}
