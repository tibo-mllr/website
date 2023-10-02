import { AdminView } from 'admin';
import { Header } from 'components';
import { HomeView } from 'home';
import { LoginView } from 'login';
import { OrganizationView } from 'organization';
import { ProjectView } from 'project';
import { ReactElement } from 'react';
import { Container } from 'react-bootstrap';
import { ConnectedProps, connect } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppState } from 'redux/types';
import { ResumeView } from 'resume';

const stateProps = (
  state: AppState,
): Pick<AppState['adminReducer'], 'token'> => ({
  token: state.adminReducer.token,
});

const connector = connect(stateProps);

function App({ token }: ConnectedProps<typeof connector>): ReactElement {
  return (
    <Router>
      <Header />
      <main
        style={{
          paddingTop: '8px',
          maxHeight: '93vh',
          overflowY: 'auto',
        }}
      >
        <Container>
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/resume" element={<ResumeView />} />
            <Route path="/projects" element={<ProjectView />} />
            <Route path="/organizations" element={<OrganizationView />} />
            <Route path="/login" element={<LoginView />} />
            {!!token && <Route path="/admin" element={<AdminView />} />}
          </Routes>
        </Container>
      </main>
    </Router>
  );
}

export default connector(App);
