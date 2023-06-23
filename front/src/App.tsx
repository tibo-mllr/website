import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import { Container } from 'react-bootstrap';
import HomeView from './home/homeView';
import { ReactElement, useState } from 'react';
import LoginView from './login/loginView';
import AdminView from './admin/adminView';

function App(): ReactElement {
  const [showNewData, setShowNewData] = useState<boolean>(false);
  const [showNewUser, setShowNewUser] = useState<boolean>(false);

  return (
    <Router>
      <Header setShowNewData={setShowNewData} setShowNewUser={setShowNewUser} />
      <main
        style={{
          paddingTop: '8px',
          height: '100vh',
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
