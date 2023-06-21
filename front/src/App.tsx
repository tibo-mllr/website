import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import { Container } from 'react-bootstrap';
import HomeView from './home/homeView';
import { ReactElement } from 'react';
import LoginView from './login/loginView';
import AdminView from './admin/adminView';

function App(): ReactElement {
  return (
    <Router>
      <Header />
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
            <Route path="/login" element={<LoginView />} />
            {!!sessionStorage.getItem('loginToken') && (
              <Route path="/admin" element={<AdminView />} />
            )}
          </Routes>
        </Container>
      </main>
    </Router>
  );
}

export default App;
