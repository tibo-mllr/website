import { logo, plusIcon } from 'assets';
import { type ReactElement } from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
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

function Header({
  token,
  userRole,
  setShowNewData,
  setShowNewUser,
  setShowNewProject,
  setShowNewOrganization,
  logout,
}: ConnectedProps<typeof connector>): ReactElement {
  const selected = window.location.pathname;
  const navigate = useNavigate();

  return (
    <header>
      <Navbar className="h-100">
        <Container fluid>
          <Navbar.Brand>
            <Link to="/home" className="navbar-brand">
              <img
                alt="Anarchist logo"
                src={logo}
                height="30"
                className="d-inline-block align-top me-2"
              />{' '}
              <b>Mini website project</b>
            </Link>
          </Navbar.Brand>
          <Nav className="me-auto">
            <Link
              to="/home"
              className={`nav-link ${selected === '/home' && 'bg-selected'}`}
            >
              Home
            </Link>
            <Link
              to="/resume"
              className={`nav-link ${selected === '/resume' && 'bg-selected'}`}
            >
              Resume
            </Link>
            <Link
              to="/projects"
              className={`nav-link ${
                selected === '/projects' && 'bg-selected'
              }`}
            >
              Projects
            </Link>
            <Link
              to="/organizations"
              className={`nav-link ${
                selected === '/organizations' && 'bg-selected'
              }`}
            >
              Organizations
            </Link>
            {!!token && (
              <Link
                to="/admin"
                className={`nav-link ${selected === '/admin' && 'bg-selected'}`}
              >
                Admin
              </Link>
            )}
          </Nav>
          <Nav className="justify-content-end">
            {!!token &&
              (userRole === 'admin' || userRole === 'superAdmin') &&
              selected === '/home' && (
                <Button
                  onClick={() => setShowNewData(true)}
                  className="btn-add"
                >
                  <img alt="Plus icon" src={plusIcon} height="16" />
                  <b>Add a news</b>
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
                  <b>Add project</b>
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
                  <b>Add organization</b>
                </Button>
              )}
            {!!token && userRole === 'superAdmin' && selected === '/admin' && (
              <Button onClick={() => setShowNewUser(true)} className="btn-add">
                <img alt="Plus icon" src={plusIcon} height="16" />
                <b>Add user</b>
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
        </Container>
      </Navbar>
    </header>
  );
}

export default connector(Header);
