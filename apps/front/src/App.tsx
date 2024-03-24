import { AdminView } from 'admin';
import { Header, MobileHeader } from 'components';
import { HomeView } from 'home';
import { LoginView } from 'login';
import { OrganizationView } from 'organization';
import { ProjectView } from 'project';
import { useEffect, type ReactElement } from 'react';
import { Container } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { type AppState } from 'reducers/types';
import { ResumeView } from 'resume';
import { client } from 'utils';

const stateProps = (
  state: AppState,
): Pick<AppState['adminReducer'], 'token'> => ({
  token: state.adminReducer.token,
});

const connector = connect(stateProps);

function App({ token }: ConnectedProps<typeof connector>): ReactElement {
  useEffect(() => {
    if (token) client.defaults.headers.common.Authorization = `Bearer ${token}`;
  }, [token]);
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  return (
    <Router>
      {isMobile ? <MobileHeader /> : <Header />}
      <main>
        <Container>
          <Routes>
            <Route path="/home" element={<HomeView />} />
            <Route path="/resume" element={<ResumeView />} />
            <Route path="/projects" element={<ProjectView />} />
            <Route path="/organizations" element={<OrganizationView />} />
            <Route path="/login" element={<LoginView />} />
            {token ? (
              <Route path="/admin" element={<AdminView />} />
            ) : (
              <Route path="/admin" element={<Navigate to="/" />} />
            )}
            <Route path="/" element={<Navigate to="/home" />} />
          </Routes>
        </Container>
      </main>
    </Router>
  );
}

export default connector(App);
