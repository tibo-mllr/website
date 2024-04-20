'use client';

import { logo, plusIcon } from '@/app/ui/assets';
import {
  logout,
  switchShowNewNews,
  switchShowNewOrganization,
  switchShowNewProject,
  switchShowNewUser,
} from '@/lib/redux/slices';
import { type AppState } from '@/lib/redux/types';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type ReactElement } from 'react';
import {
  Button,
  Col,
  Container,
  Dropdown,
  Nav,
  Navbar,
  Row,
} from 'react-bootstrap';
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

function MobileHeader({
  token,
  userRole,
  setShowNewData,
  setShowNewUser,
  setShowNewProject,
  setShowNewOrganization,
  logout,
}: ConnectedProps<typeof connector>): ReactElement {
  const pathname = usePathname();
  const capitalizedSelected =
    pathname.charAt(1).toUpperCase() + pathname.slice(2);
  const router = useRouter();

  return (
    <header>
      <div className="h-100 navbar navbar-expand navbar-light">
        <Container fluid>
          <Col>
            <Row>
              <Col>
                <Navbar.Brand>
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
                </Navbar.Brand>
              </Col>
              <Col>
                <Nav className="justify-content-end">
                  {!!token &&
                    (userRole === 'admin' || userRole === 'superAdmin') &&
                    pathname === '/home' && (
                      <Button
                        onClick={() => setShowNewData(true)}
                        className="btn-add"
                      >
                        <Image alt="Plus icon" src={plusIcon} height="16" />
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
                      </Button>
                    )}
                  {!!token &&
                    userRole === 'superAdmin' &&
                    pathname === '/admin' && (
                      <Button
                        onClick={() => setShowNewUser(true)}
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
                        logout();
                        router.push('/');
                      }}
                    >
                      Logout
                    </Button>
                  )}
                </Nav>
              </Col>
            </Row>
            <Row>
              <Dropdown>
                <Dropdown.Toggle>{capitalizedSelected}</Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    className={pathname === '/home' ? 'bg-selected' : ''}
                  >
                    <Link href="/home" className="nav-link">
                      Home
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item
                    className={pathname === '/resume' ? 'bg-selected' : ''}
                  >
                    <Link href="/resume" className="nav-link">
                      Resume
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item
                    className={pathname === '/projects' ? 'bg-selected' : ''}
                  >
                    <Link className="nav-link" href="/projects">
                      Projects
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item
                    className={
                      pathname === '/organizations' ? 'bg-selected' : ''
                    }
                  >
                    <Link href="/organizations" className="nav-link">
                      Organizations
                    </Link>
                  </Dropdown.Item>
                  {!!token && (
                    <Dropdown.Item
                      className={pathname === '/admin' ? 'bg-selected' : ''}
                    >
                      <Link href="/admin" className="nav-link">
                        Admin
                      </Link>
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Row>
          </Col>
        </Container>
      </div>
    </header>
  );
}

export default connector(MobileHeader);
