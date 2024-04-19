'use client';

import { type ReactElement } from 'react';
import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';

export default function Header(): ReactElement {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (isMobile) {
    return <MobileHeader />;
  }

  return <DesktopHeader />;
}
