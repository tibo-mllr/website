import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import { Container } from 'react-bootstrap';
import HomeView from './home/homeView';
import { ReactElement, useState } from 'react';
import LoginView from './login/loginView';
import AdminView from './admin/adminView';
import ProjectView from './project/projectView';
import OrganizationView from './organization/organizationView';

function App(): ReactElement {
  const [showNewData, setShowNewData] = useState<boolean>(false);
  const [showNewOrganization, setShowNewOrganization] =
    useState<boolean>(false);
  const [showNewUser, setShowNewUser] = useState<boolean>(false);

  return (
    <Router>
      <Header
        setShowNewData={setShowNewData}
        setShowNewUser={setShowNewUser}
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
            <Route
              path="/organizations"
              element={
                <OrganizationView
                  showNew={showNewOrganization}
                  setShowNew={setShowNewOrganization}
                />
              }
            />
            <Route path="/projects" element={<ProjectView />} />
            <Route path="/login" element={<LoginView />} />
            {!!sessionStorage.getItem('loginToken') && (
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
