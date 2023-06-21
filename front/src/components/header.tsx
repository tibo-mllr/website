import { ReactElement } from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Header(): ReactElement {
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
            {!sessionStorage.getItem('loginToken') ? (
              <Button variant="outline-light" href="/login">
                Login admin
              </Button>
            ) : (
              <Button
                variant="outline-light"
                onClick={(): void => {
                  sessionStorage.removeItem('loginToken');
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
