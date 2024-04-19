'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactElement, type ReactNode } from 'react';

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement | null {
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    setToken(sessionStorage.getItem('token') || '');
  }, []);

  // If the token is set, authorize to render the children
  if (token) return <>{children}</>;

  // If the token is not yet set, do nothing
  if (token === null) return null;

  // If the token is set but is empty, redirect to the home page
  router.push('/');
  return null;
}
