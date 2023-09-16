import { logo, plusIcon } from 'assets';
import { ReactElement } from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

type HeaderProps = {
  setShowNewData: (showNew: boolean) => void;
  setShowNewUser: (showNew: boolean) => void;
  setShowNewProject: (showNew: boolean) => void;
  setShowNewOrganization: (showNew: boolean) => void;
};

export function Header({
  setShowNewData,
  setShowNewUser,
  setShowNewProject,
  setShowNewOrganization,
}: HeaderProps): ReactElement {
  const selected = window.location.pathname;
  const navigate = useNavigate();

  return (
    <header style={{ maxHeight: '7vh' }}>
      <Navbar bg="dark" variant="dark" sticky="top">
        <Container fluid>
          <Navbar.Brand href="/">
            <img
              alt="Anarchist logo"
              src={logo}
              height="30"
              className="d-inline-block align-top"
            />{' '}
            <b>Mini website project</b>
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link
              href="/"
              className={selected === '/' ? 'bg-selected' : undefined}
            >
              Home
            </Nav.Link>
            <Nav.Link
              href="/resume"
              className={selected === '/resume' ? 'bg-selected' : undefined}
            >
              Resume
            </Nav.Link>
            <Nav.Link
              href="/projects"
              className={selected === '/projects' ? 'bg-selected' : undefined}
            >
              Projects
            </Nav.Link>
            <Nav.Link
              href="/organizations"
              className={
                selected === '/organizations' ? 'bg-selected' : undefined
              }
            >
              Organizations
            </Nav.Link>
            {!!sessionStorage.getItem('loginToken') && (
              <Nav.Link
                href="/admin"
                className={selected === '/admin' ? 'bg-selected' : undefined}
              >
                Admin
              </Nav.Link>
            )}
          </Nav>
          <Nav className="justify-content-end">
            {!!sessionStorage.getItem('loginToken') &&
              (sessionStorage.getItem('role') === 'admin' ||
                sessionStorage.getItem('role') === 'superAdmin') &&
              selected === '/' && (
                <Button
                  onClick={(): void => setShowNewData(true)}
                  style={{ marginRight: '8px' }}
                >
                  <img
                    alt="Plus icon"
                    src={plusIcon}
                    height="16"
                    className="d-inline-block align-center"
                    style={{ paddingRight: '8px' }}
                  />
                  <b className="d-inline-block align-center">Add a news</b>
                </Button>
              )}
            {!!sessionStorage.getItem('loginToken') &&
              (sessionStorage.getItem('role') === 'admin' ||
                sessionStorage.getItem('role') === 'superAdmin') &&
              selected === '/projects' && (
                <Button
                  onClick={(): void => setShowNewProject(true)}
                  style={{ marginRight: '8px' }}
                >
                  <img
                    alt="Plus icon"
                    src={plusIcon}
                    height="16"
                    className="d-inline-block align-center"
                    style={{ paddingRight: '8px' }}
                  />
                  <b className="d-inline-block align-center">Add project</b>
                </Button>
              )}
            {!!sessionStorage.getItem('loginToken') &&
              (sessionStorage.getItem('role') === 'admin' ||
                sessionStorage.getItem('role') === 'superAdmin') &&
              selected === '/organizations' && (
                <Button
                  onClick={(): void => setShowNewOrganization(true)}
                  style={{ marginRight: '8px' }}
                >
                  <img
                    alt="Plus icon"
                    src={plusIcon}
                    height="16"
                    className="d-inline-block align-center"
                    style={{ paddingRight: '8px' }}
                  />
                  <b className="d-inline-block align-center">
                    Add organization
                  </b>
                </Button>
              )}
            {!!sessionStorage.getItem('loginToken') &&
              sessionStorage.getItem('role') === 'superAdmin' &&
              selected === '/admin' && (
                <Button
                  onClick={(): void => setShowNewUser(true)}
                  style={{ marginRight: '8px' }}
                >
                  <img
                    alt="Plus icon"
                    src={plusIcon}
                    height="16"
                    className="d-inline-block align-center"
                    style={{ paddingRight: '8px' }}
                  />
                  <b className="d-inline-block align-center">Add user</b>
                </Button>
              )}
            {!sessionStorage.getItem('loginToken') ? (
              <Nav.Link href="/login">Account</Nav.Link>
            ) : (
              <Button
                variant="outline-light"
                onClick={(): void => {
                  sessionStorage.removeItem('loginToken');
                  sessionStorage.removeItem('role');
                  sessionStorage.removeItem('id');
                  navigate('/');
                }}
              >
                Logout
              </Button>
            )}
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
