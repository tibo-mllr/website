import Card from 'react-bootstrap/card';
import Form from 'react-bootstrap/form';
import { FormEvent, ReactElement, useState } from 'react';
import { client } from '../utils';
import { Button, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

type LoginProps = {
  setLoginToken: (token: string) => void;
};
export default function LoginView({ setLoginToken }: LoginProps): ReactElement {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    client
      .post('/auth/login/', {
        username: username,
        password: password,
      })
      .then((response) => {
        setLoginToken(response.data.access_token);
        sessionStorage.setItem('loginToken', response.data.access_token);
        navigate('/admin');
      })
      .catch((error) => {
        alert('Erreur de connexion');
        console.log(error);
      });
  };

  return (
    <Row>
      <Col
        md={12}
        className="col d-flex flex-column justify-content-center align-items-center"
      >
        <Card className="w-50 mt-5">
          <Form onSubmit={handleSubmit}>
            <Card.Body>
              <Form.Group>
                <Form.Label>Nom d'utilisateur</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Entrez votre nom d'utilisateur"
                  value={username}
                  onChange={(event): void => setUsername(event.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(event): void => setPassword(event.target.value)}
                />
              </Form.Group>
            </Card.Body>
            <Card.Footer>
              <Button variant="outline-secondary" type="submit">
                Se connecter
              </Button>
            </Card.Footer>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}
