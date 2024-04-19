import { logo, plusIcon } from 'assets';
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
import { Link, useNavigate } from 'react-router-dom';
import {
  logout,
  switchShowNewNews,
  switchShowNewOrganization,
  switchShowNewProject,
  switchShowNewUser,
} from 'reducers/slices';
import { type AppState } from 'reducers/types';

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
  const selected = window.location.pathname;
  const capitalizedSelected =
    selected.charAt(1).toUpperCase() + selected.slice(2);
  const navigate = useNavigate();

  return (
    <header>
      <Navbar className="h-100">
        <Container fluid>
          <Col>
            <Row>
              <Col>
                <Navbar.Brand>
                  <Link to="/home" className="navbar-brand">
                    <img
                      alt="Anarchist logo"
                      src={logo}
                      height="30"
                      className="d-inline-block align-top"
                    />{' '}
                    <b>Mini website</b>
                  </Link>
                </Navbar.Brand>
              </Col>
              <Col>
                <Nav className="justify-content-end">
                  {!!token &&
                    (userRole === 'admin' || userRole === 'superAdmin') &&
                    selected === '/home' && (
                      <Button
                        onClick={() => setShowNewData(true)}
                        className="btn-add"
                      >
                        <img alt="Plus icon" src={plusIcon} height="16" />
                      </Button>
                    )}
                  {!!token &&
                    (userRole === 'admin' || userRole === 'superAdmin') &&
                    selected === '/projects' && (
                      <Button
                        onClick={() => setShowNewProject(true)}
                        className="btn-add"
                      >
                        <img alt="Plus icon" src={plusIcon} height="16" />
                      </Button>
                    )}
                  {!!token &&
                    (userRole === 'admin' || userRole === 'superAdmin') &&
                    selected === '/organizations' && (
                      <Button
                        onClick={() => setShowNewOrganization(true)}
                        className="btn-add"
                      >
                        <img alt="Plus icon" src={plusIcon} height="16" />
                      </Button>
                    )}
                  {!!token &&
                    userRole === 'superAdmin' &&
                    selected === '/admin' && (
                      <Button
                        onClick={() => setShowNewUser(true)}
                        className="btn-add"
                      >
                        <img alt="Plus icon" src={plusIcon} height="16" />
                      </Button>
                    )}
                  {!token ? (
                    <Link to="/login" className="nav-link">
                      Account
                    </Link>
                  ) : (
                    <Button
                      className="btn-logout"
                      onClick={() => {
                        logout();
                        navigate('/');
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
                    className={selected === '/home' ? 'bg-selected' : ''}
                  >
                    <Link to="/home" className="nav-link">
                      Home
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item
                    className={selected === '/resume' ? 'bg-selected' : ''}
                  >
                    <Link to="/resume" className="nav-link">
                      Resume
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item
                    className={selected === '/projects' ? 'bg-selected' : ''}
                  >
                    <Link className="nav-link" to="/projects">
                      Projects
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item
                    className={
                      selected === '/organizations' ? 'bg-selected' : ''
                    }
                  >
                    <Link to="/organizations" className="nav-link">
                      Organizations
                    </Link>
                  </Dropdown.Item>
                  {!!token && (
                    <Dropdown.Item
                      className={selected === '/admin' ? 'bg-selected' : ''}
                    >
                      <Link to="/admin" className="nav-link">
                        Admin
                      </Link>
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Row>
          </Col>
        </Container>
      </Navbar>
    </header>
  );
}

export default connector(MobileHeader);
