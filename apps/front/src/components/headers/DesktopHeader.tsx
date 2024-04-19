'use client';

import { logo, plusIcon } from '@/assets';
import {
  logout,
  switchShowNewNews,
  switchShowNewOrganization,
  switchShowNewProject,
  switchShowNewUser,
} from '@/redux/slices';
import { type AppState } from '@/redux/types';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type ReactElement } from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';

const stateProps = (
  state: AppState,
): Pick<AppState['adminReducer'], 'token' | 'userRole'> => ({
  token: state.adminReducer.token,
  userRole: state.adminReducer.userRole,
});

const dispatchProps = {
  setShowNewData: switchShowNewNews,
  setShowNewOrganization: switchShowNewOrganization,
  setShowNewProject: switchShowNewProject,
  setShowNewUser: switchShowNewUser,
  logout,
};

const connector = connect(stateProps, dispatchProps);

function Header({
  token,
  userRole,
  setShowNewData,
  setShowNewUser,
  setShowNewProject,
  setShowNewOrganization,
  logout,
}: ConnectedProps<typeof connector>): ReactElement {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header>
      <div className="h-100 navbar navbar-expand navbar-light">
        <Container fluid>
          <Navbar.Brand>
            <Link href="/home" className="navbar-brand">
              <Image
                alt="Anarchist logo"
                src={logo}
                height="30"
                className="d-inline-block align-top me-2"
                priority
              />{' '}
              <b>Mini website project</b>
            </Link>
          </Navbar.Brand>
          <Nav className="me-auto">
            <Link
              href="/home"
              className={`nav-link ${pathname === '/home' && 'bg-selected'}`}
            >
              Home
            </Link>
            <Link
              href="/resume"
              className={`nav-link ${pathname === '/resume' && 'bg-selected'}`}
            >
              Resume
            </Link>
            <Link
              href="/projects"
              className={`nav-link ${pathname === '/projects' && 'bg-selected'}`}
            >
              Projects
            </Link>
            <Link
              href="/organizations"
              className={`nav-link ${
                pathname === '/organizations' && 'bg-selected'
              }`}
            >
              Organizations
            </Link>
            {!!token && (
              <Link
                href="/admin"
                className={`nav-link ${pathname === '/admin' && 'bg-selected'}`}
              >
                Admin
              </Link>
            )}
          </Nav>
          <Nav className="justify-content-end">
            {!!token &&
              (userRole === 'admin' || userRole === 'superAdmin') &&
              pathname === '/home' && (
                <Button
                  onClick={() => setShowNewData(true)}
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
                  onClick={() => setShowNewProject(true)}
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
                  onClick={() => setShowNewOrganization(true)}
                  className="btn-add"
                >
                  <Image alt="Plus icon" src={plusIcon} height="16" />
                  <b>Add organization</b>
                </Button>
              )}
            {!!token && userRole === 'superAdmin' && pathname === '/admin' && (
              <Button onClick={() => setShowNewUser(true)} className="btn-add">
                <Image alt="Plus icon" src={plusIcon} height="16" />
                <b>Add user</b>
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
                  logout();
                  router.push('/');
                }}
              >
                Logout
              </Button>
            )}
          </Nav>
        </Container>
      </div>
    </header>
  );
}

export default connector(Header);
