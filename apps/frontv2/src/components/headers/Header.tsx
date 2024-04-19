'use client';

import { useEffect, useState, type ReactElement } from 'react';
import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';

export default function Header(): ReactElement {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    setIsMobile(window.matchMedia('(max-width: 768px)').matches);
  }, []);

  if (isMobile) {
    return <MobileHeader />;
  }

  return <DesktopHeader />;
}
