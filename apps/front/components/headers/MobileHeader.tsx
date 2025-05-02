'use client';

import {
  AppBar,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Toolbar,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type ReactElement } from 'react';

import { useAppDispatch } from '@/lib/redux/hooks';
import {
  switchShowNewNews,
  switchShowNewOrganization,
  switchShowNewProject,
  switchShowNewUser,
} from '@/lib/redux/slices';

import { AddButton } from '..';
import { useAuth } from '../AuthProvider';

const ADD_BUTTON_PATHNAMES = ['/home', '/projects', '/organizations'];
type AddButtonPathnames = (typeof ADD_BUTTON_PATHNAMES)[number];

export default function MobileHeader(): ReactElement {
  const pathname = usePathname();
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { token, userRole, logout } = useAuth();

  const handleChange = (event: SelectChangeEvent): void => {
    const selectedPath = event.target.value;
    router.push(selectedPath);
  };

  const pathnameToText: Record<AddButtonPathnames, string> = {
    '/home': 'Add a news',
    '/projects': 'Add project',
    '/organizations': 'Add organization',
  };

  const pathnameToAction: Record<AddButtonPathnames, () => void> = {
    '/home': () => dispatch(switchShowNewNews(true)),
    '/projects': () => dispatch(switchShowNewProject(true)),
    '/organizations': () => dispatch(switchShowNewOrganization(true)),
  };

  return (
    <AppBar position="sticky" enableColorOnDark>
      <Toolbar>
        <Link href="/home" style={{ marginRight: '1em' }}>
          <Image
            alt="Website logo"
            src="/logo.png"
            height={2067}
            width={4422}
            className="d-inline-block align-top"
            priority
            style={{ height: 40, width: 'auto' }}
          />
        </Link>
        <Grid className="ms-auto me-2 justify-content-end" display="flex">
          {!!token &&
            (userRole === 'admin' || userRole === 'superAdmin') &&
            ADD_BUTTON_PATHNAMES.includes(pathname) && (
              <AddButton
                onClick={pathnameToAction[pathname]}
                text={pathnameToText[pathname]}
              />
            )}
          {!!token && userRole === 'superAdmin' && pathname === '/admin' && (
            <AddButton
              onClick={() => dispatch(switchShowNewUser(true))}
              text="Add user"
            />
          )}
          {!token ? (
            <Button LinkComponent={Link} href="/login" variant="outlined">
              Account
            </Button>
          ) : (
            <Button
              className="btn-logout"
              onClick={() => {
                logout().then(() => {
                  if (pathname === '/admin') router.push('/');
                });
              }}
            >
              Logout
            </Button>
          )}
        </Grid>
        <Grid>
          <FormControl>
            <Select
              value={pathname}
              onChange={handleChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Navigation Menu' }}
              className="my-2"
            >
              <MenuItem value="/home">Home</MenuItem>
              <MenuItem value="/resume">Resume</MenuItem>
              <MenuItem value="/projects">Projects</MenuItem>
              <MenuItem value="/organizations">Organizations</MenuItem>
              {!!token && <MenuItem value="/admin">Admin</MenuItem>}
            </Select>
          </FormControl>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
