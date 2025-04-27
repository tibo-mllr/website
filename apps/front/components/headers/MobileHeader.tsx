'use client';

import { AppBar, Button, Grid, MenuItem, Select, Toolbar } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactElement } from 'react';
import { useSelector } from 'react-redux';

import { darkIcon, lightIcon, logo, plusIcon } from '@/app/ui/assets';
import {
  getPreferredTheme,
  setStoredTheme,
  setTheme,
  showActiveTheme,
} from '@/app/ui/theme';
import { useAppDispatch } from '@/lib/redux/hooks';
import {
  logout,
  selectToken,
  selectUserRole,
  switchShowNewNews,
  switchShowNewOrganization,
  switchShowNewProject,
  switchShowNewUser,
} from '@/lib/redux/slices';

export default function MobileHeader(): ReactElement {
  const pathname = usePathname();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const token = useSelector(selectToken);
  const userRole = useSelector(selectUserRole);

  const [selectedTheme, setSelectedTheme] = useState('dark');

  useEffect(() => {
    setSelectedTheme(getPreferredTheme());
  }, []);

  return (
    <AppBar position="sticky" enableColorOnDark>
      <Toolbar>
        <Grid className="mb-2">
          <Grid>
            <Link href="/home" className="navbar-brand">
              <Image
                alt="Anarchist logo"
                src={logo}
                height="30"
                className="d-inline-block align-top"
                priority
              />{' '}
              <b>Mini website</b>
            </Link>
          </Grid>
          <Grid className="justify-content-end">
            {!!token &&
              (userRole === 'admin' || userRole === 'superAdmin') &&
              pathname === '/home' && (
                <Button
                  onClick={() => dispatch(switchShowNewNews(true))}
                  className="btn-add"
                >
                  <Image alt="Plus icon" src={plusIcon} height="16" />
                </Button>
              )}
            {!!token &&
              (userRole === 'admin' || userRole === 'superAdmin') &&
              pathname === '/projects' && (
                <Button
                  onClick={() => dispatch(switchShowNewProject(true))}
                  className="btn-add"
                >
                  <Image alt="Plus icon" src={plusIcon} height="16" />
                </Button>
              )}
            {!!token &&
              (userRole === 'admin' || userRole === 'superAdmin') &&
              pathname === '/organizations' && (
                <Button
                  onClick={() => dispatch(switchShowNewOrganization(true))}
                  className="btn-add"
                >
                  <Image alt="Plus icon" src={plusIcon} height="16" />
                </Button>
              )}
            {!!token && userRole === 'superAdmin' && pathname === '/admin' && (
              <Button
                onClick={() => dispatch(switchShowNewUser(true))}
                className="btn-add"
              >
                <Image alt="Plus icon" src={plusIcon} height="16" />
              </Button>
            )}
            {!token ? (
              <Link href="/login" className="nav-link">
                Account
              </Link>
            ) : (
              <Button
                className="btn-logout"
                onClick={() => {
                  dispatch(logout());
                  if (pathname === '/admin') router.push('/');
                }}
              >
                Logout
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid>
          <Grid>
            <Select>
              <MenuItem className={pathname === '/home' ? 'bg-selected' : ''}>
                <Link href="/home" className="nav-link">
                  Home
                </Link>
              </MenuItem>
              <MenuItem className={pathname === '/resume' ? 'bg-selected' : ''}>
                <Link href="/resume" className="nav-link">
                  Resume
                </Link>
              </MenuItem>
              <MenuItem
                className={pathname === '/projects' ? 'bg-selected' : ''}
              >
                <Link className="nav-link" href="/projects">
                  Projects
                </Link>
              </MenuItem>
              <MenuItem
                className={pathname === '/organizations' ? 'bg-selected' : ''}
              >
                <Link href="/organizations" className="nav-link">
                  Organizations
                </Link>
              </MenuItem>
              {!!token && (
                <MenuItem
                  className={pathname === '/admin' ? 'bg-selected' : ''}
                >
                  <Link href="/admin" className="nav-link">
                    Admin
                  </Link>
                </MenuItem>
              )}
            </Select>
          </Grid>
          <Grid>
            <Select>
              <MenuItem
                className={`nav-link d-flex align-items-center me-4 ${selectedTheme === 'light' && 'bg-selected'}`}
                onClick={() => {
                  const theme = 'light';
                  setStoredTheme(theme);
                  setTheme(theme);
                  showActiveTheme(theme);
                  setSelectedTheme(theme);
                }}
              >
                <Image
                  alt="Light mode icon"
                  src={lightIcon}
                  height="24"
                  className="me-2"
                />
                Light
              </MenuItem>
              <MenuItem
                className={`nav-link d-flex align-items-center ${selectedTheme === 'dark' && 'bg-selected'}`}
                onClick={() => {
                  const theme = 'dark';
                  setStoredTheme(theme);
                  setTheme(theme);
                  showActiveTheme(theme);
                  setSelectedTheme(theme);
                }}
              >
                <Image
                  alt="Dark mode icon"
                  src={darkIcon}
                  height="24"
                  className="me-2"
                />
                Dark
              </MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
