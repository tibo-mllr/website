import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import { Container } from 'react-bootstrap';
import HomeView from './home/homeView';
import { ReactElement, useState } from 'react';
import LoginView from './login/loginView';

function App(): ReactElement {
  const [loginToken, setLoginToken] = useState<string>(
    sessionStorage.getItem('loginToken') || '',
  );

  return (
    <Router>
      <Header loginToken={loginToken} setLoginToken={setLoginToken} />
      <main
        style={{
          paddingTop: '8px',
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        <Container>
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route
              path="/login"
              element={<LoginView setLoginToken={setLoginToken} />}
            />
            {!!loginToken && <Route path="/admin" element={<div>Admin</div>} />}
          </Routes>
        </Container>
      </main>
    </Router>
  );
}

export default App;
