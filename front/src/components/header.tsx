import { ReactElement } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';

export default function Header(): ReactElement {
  return (
    <header>
      <Navbar bg="dark" variant="dark" sticky="top">
        <Container fluid>
          <Navbar.Brand href="/">
            <img
              alt=""
              src="/logo192.png"
              height="30"
              className="d-inline-block align-top"
            />
            <b>Mini website project</b>
          </Navbar.Brand>
          <Nav className="me-auto"></Nav>
        </Container>
      </Navbar>
    </header>
  );
}
