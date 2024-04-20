'use client';

import { selectToken } from '@/lib/redux/slices';
import { useRouter } from 'next/navigation';
import { type ReactElement, type ReactNode } from 'react';
import { useSelector } from 'react-redux';

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement | null {
  const token = useSelector(selectToken);

  const router = useRouter();

  // If the token is set, authorize to render the children
  if (token) return <>{children}</>;

  // If the token is not yet set, do nothing
  if (token === null) return null;

  // If the token is set but is empty, redirect to the home page
  router.push('/');
  return null;
}
