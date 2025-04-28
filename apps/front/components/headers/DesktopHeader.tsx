'use client';

import { AppBar, Button, Grid, Toolbar, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type ReactElement } from 'react';
import { useSelector } from 'react-redux';

import { logo, plusIcon } from '@/app/ui/assets';
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

export default function Header(): ReactElement {
  const pathname = usePathname();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const token = useSelector(selectToken);
  const userRole = useSelector(selectUserRole);

  return (
    <AppBar position="sticky" color="inherit" enableColorOnDark>
      <Toolbar style={{ gap: 4 }}>
        <Link
          href="/home"
          style={{ display: 'flex', alignItems: 'center', marginRight: '1em' }}
        >
          <Image
            alt="Website logo"
            src={logo}
            height="40"
            className="d-inline-block align-top me-2"
            priority
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
        <Grid className="ms-auto justify-content-end" display="flex">
          {!!token &&
            (userRole === 'admin' || userRole === 'superAdmin') &&
            pathname === '/home' && (
              <Button
                onClick={() => dispatch(switchShowNewNews(true))}
                className="btn-add"
              >
                <Image alt="Plus icon" src={plusIcon} height="16" />
                <b>Add a news</b>
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
                <b>Add project</b>
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
                <b>Add organization</b>
              </Button>
            )}
          {!!token && userRole === 'superAdmin' && pathname === '/admin' && (
            <Button
              onClick={() => dispatch(switchShowNewUser(true))}
              className="btn-add"
            >
              <Image alt="Plus icon" src={plusIcon} height="16" />
              <b>Add user</b>
            </Button>
          )}

          {!token ? (
            <Button LinkComponent={Link} href="/login" variant="outlined">
              Account
            </Button>
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
      </Toolbar>
    </AppBar>
  );
}
