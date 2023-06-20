import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import { Container } from 'react-bootstrap';
import HomeView from './home/homeView';
import { ReactElement } from 'react';

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
          </Routes>
        </Container>
      </main>
    </Router>
  );
}

export default App;
