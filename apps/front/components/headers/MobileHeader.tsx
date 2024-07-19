'use client';

import {
  logo,
  plusIcon,
  darkIcon,
  lightIcon,
  darkSelectedIcon,
} from '@/app/ui/assets';
import {
  setTheme,
  showActiveTheme,
  setStoredTheme,
  getPreferredTheme,
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
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactElement } from 'react';
import {
  Button,
  Col,
  Container,
  Dropdown,
  Nav,
  Navbar,
  Row,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';

export default function MobileHeader(): ReactElement {
  const pathname = usePathname();
  const capitalizedSelected =
    pathname.charAt(1).toUpperCase() + pathname.slice(2);
  const router = useRouter();

  const dispatch = useAppDispatch();
  const token = useSelector(selectToken);
  const userRole = useSelector(selectUserRole);

  const [selectedTheme, setSelectedTheme] = useState('dark');

  useEffect(() => {
    setSelectedTheme(getPreferredTheme());
  }, []);

  return (
    <header>
      <div className="h-100 navbar navbar-expand navbar-light">
        <Container fluid>
          <Col>
            <Row className="mb-2">
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
                        onClick={() =>
                          dispatch(switchShowNewOrganization(true))
                        }
                        className="btn-add"
                      >
                        <Image alt="Plus icon" src={plusIcon} height="16" />
                      </Button>
                    )}
                  {!!token &&
                    userRole === 'superAdmin' &&
                    pathname === '/admin' && (
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
                </Nav>
              </Col>
            </Row>
            <Row>
              <Col>
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
              </Col>
              <Col>
                <Nav className="justify-content-end">
                  <Dropdown>
                    <Dropdown.Toggle
                      id="bd-theme"
                      className="d-flex align-items-center justify-content-center"
                    >
                      <Image
                        alt="Current mode icon"
                        src={darkSelectedIcon}
                        height="24"
                        className="theme-icon-active"
                      />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
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
                      </Dropdown.Item>
                      <Dropdown.Item
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
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Nav>
              </Col>
            </Row>
          </Col>
        </Container>
      </div>
    </header>
  );
}
