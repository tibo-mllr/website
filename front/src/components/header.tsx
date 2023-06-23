import { ReactElement } from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

type HeaderProps = {
  setShowNewData: (showNew: boolean) => void;
  setShowNewUser: (showNew: boolean) => void;
};

export default function Header({
  setShowNewData,
  setShowNewUser,
}: HeaderProps): ReactElement {
  const selected = window.location.pathname;
  const navigate = useNavigate();

  return (
    <header>
      <Navbar bg="dark" variant="dark" sticky="top">
        <Container fluid>
          <Navbar.Brand href="/">
            <img
              alt="Anarchist logo"
              src="/logo192.png"
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
            {!!sessionStorage.getItem('loginToken') && (
              <Nav.Link
                href="admin"
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
                    src="/plusIcon.png"
                    height="16"
                    className="d-inline-block align-center"
                    style={{ paddingRight: '8px' }}
                  />
                  <b className="d-inline-block align-center">Add data</b>
                </Button>
              )}
            {!!sessionStorage.getItem('loginToken') &&
              (sessionStorage.getItem('role') === 'admin' ||
                sessionStorage.getItem('role') === 'superAdmin') &&
              selected === '/admin' && (
                <Button
                  onClick={(): void => setShowNewUser(true)}
                  style={{ marginRight: '8px' }}
                >
                  <img
                    alt="Plus icon"
                    src="/plusIcon.png"
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
