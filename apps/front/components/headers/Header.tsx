'use client';

import { useMediaQuery, useTheme } from '@mui/material';
import { type ReactElement } from 'react';

import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';

export default function Header(): ReactElement {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isMobile) {
    return <MobileHeader />;
  }

  return <DesktopHeader />;
}
