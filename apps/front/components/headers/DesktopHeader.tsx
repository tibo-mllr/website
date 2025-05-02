'use client';

import { AppBar, Button, Grid, Toolbar, Typography } from '@mui/material';
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

export default function Header(): ReactElement {
  const pathname = usePathname();
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { token, userRole, logout } = useAuth();

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
    <AppBar position="sticky" color="inherit" enableColorOnDark>
      <Toolbar style={{ gap: 4 }}>
        <Link
          href="/home"
          style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: '1em',
          }}
        >
          <Image
            alt="Website logo"
            src="/logo.png"
            height={2067}
            width={4422}
            className="d-inline-block align-top me-2"
            priority
            style={{ height: 40, width: 'auto' }}
          />
          <Typography variant="h5">Mini website project</Typography>
        </Link>
        <Button
          LinkComponent={Link}
          href="/home"
          variant={pathname === '/home' ? 'contained' : 'outlined'}
        >
          Home
        </Button>
        <Button
          LinkComponent={Link}
          href="/resume"
          variant={pathname === '/resume' ? 'contained' : 'outlined'}
        >
          Resume
        </Button>
        <Button
          LinkComponent={Link}
          href="/projects"
          variant={pathname === '/projects' ? 'contained' : 'outlined'}
        >
          Projects
        </Button>
        <Button
          LinkComponent={Link}
          href="/organizations"
          variant={pathname === '/organizations' ? 'contained' : 'outlined'}
        >
          Organizations
        </Button>
        {!!token && (
          <Button
            LinkComponent={Link}
            href="/admin"
            variant={pathname === '/admin' ? 'contained' : 'outlined'}
          >
            Admin
          </Button>
        )}
        <Grid className="ms-auto" display="flex" flexDirection="row">
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
      </Toolbar>
    </AppBar>
  );
}
