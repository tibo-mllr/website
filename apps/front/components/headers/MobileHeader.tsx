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

export default function MobileHeader(): ReactElement {
  const pathname = usePathname();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const token = useSelector(selectToken);
  const userRole = useSelector(selectUserRole);

  const handleChange = (event: SelectChangeEvent): void => {
    const selectedPath = event.target.value;
    router.push(selectedPath);
  };

  return (
    <AppBar position="sticky" enableColorOnDark>
      <Toolbar>
        <Link href="/home" style={{ marginRight: '1em' }}>
          <Image
            alt="Anarchist logo"
            src={logo}
            height="40"
            className="d-inline-block align-top"
            priority
          />
        </Link>
        <Grid className="ms-auto me-2 justify-content-end" display="flex">
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
