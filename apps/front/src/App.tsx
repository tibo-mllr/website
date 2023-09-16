import { AdminView } from 'admin';
import { Header } from 'components';
import { HomeView } from 'home';
import { LoginView } from 'login';
import { OrganizationView } from 'organization';
import { ProjectView } from 'project';
import { ReactElement, useState } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ResumeView } from 'resume';

function App(): ReactElement {
  const [showNewData, setShowNewData] = useState<boolean>(false);
  const [showNewOrganization, setShowNewOrganization] =
    useState<boolean>(false);
  const [showNewUser, setShowNewUser] = useState<boolean>(false);
  const [showNewProject, setShowNewProject] = useState<boolean>(false);
  const [loginToken, setLoginToken] = useState<string>(
    sessionStorage.getItem('loginToken') || '',
  );

  return (
    <Router>
      <Header
        setShowNewData={setShowNewData}
        setShowNewUser={setShowNewUser}
        setShowNewProject={setShowNewProject}
        setShowNewOrganization={setShowNewOrganization}
      />
      <main
        style={{
          paddingTop: '8px',
          maxHeight: '93vh',
          overflowY: 'auto',
        }}
      >
        <Container>
          <Routes>
            <Route
              path="/"
              element={
                <HomeView showNew={showNewData} setShowNew={setShowNewData} />
              }
            />
            <Route path="/resume" element={<ResumeView />} />
            <Route
              path="/projects"
              element={
                <ProjectView
                  showNew={showNewProject}
                  setShowNew={setShowNewProject}
                />
              }
            />
            <Route
              path="/organizations"
              element={
                <OrganizationView
                  showNew={showNewOrganization}
                  setShowNew={setShowNewOrganization}
                />
              }
            />
            <Route
              path="/login"
              element={<LoginView setLoginToken={setLoginToken} />}
            />
            {(!!sessionStorage.getItem('loginToken') || !!loginToken) && (
              <Route
                path="/admin"
                element={
                  <AdminView
                    showNew={showNewUser}
                    setShowNew={setShowNewUser}
                  />
                }
              />
            )}
          </Routes>
        </Container>
      </main>
    </Router>
  );
}

export default App;
