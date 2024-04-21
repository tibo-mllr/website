'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactElement, type ReactNode } from 'react';

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement | null {
  // We use session storage instead of redux because at the beginning of each refresh,
  // even if we are connected, the store doesn't have the token yet
  // so when we refresh the page, we are always redirected to the home page.
  // With session storage, we can check if the token is set before rendering the children.
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
