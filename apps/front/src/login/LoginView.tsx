import { UserRole } from '@website/shared-types';
import { CreateUserModal } from 'admin';
import { FormEvent, ReactElement, useEffect, useState } from 'react';
import { Button, Col, Row, Card, Form } from 'react-bootstrap';
import { ConnectedProps, connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, switchShowNewUser } from 'redux/slices';
import { DOCUMENT_TITLE, client } from 'utils';

const dispatchProps = { login, setShowNew: switchShowNewUser };

const connector = connect(null, dispatchProps);

export function LoginView({
  login,
  setShowNew,
}: ConnectedProps<typeof connector>): ReactElement {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    client
      .post<{ access_token: string; role: UserRole }>('/auth/login/', {
        username: username,
        password: password,
      })
      .then(({ data: { access_token, role } }) => {
        login({ token: access_token, userRole: role });
        navigate('/admin');
      })
      .catch((error) => {
        alert('Erreur de connexion');
        console.error(error);
      });
  };

  useEffect(() => {
    document.title = `Login | ${DOCUMENT_TITLE}`;
  }, []);

  return (
    <>
      <Row>
        <Col
          md={12}
          className="col d-flex flex-column justify-content-center align-items-center"
        >
          <Card className="w-50 mt-5">
            <Form onSubmit={handleSubmit}>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Nom d'utilisateur</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Entrez votre nom d'utilisateur"
                    value={username}
                    onChange={(event): void => setUsername(event.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
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
                <Row>
                  <Col>
                    <Button variant="outline-secondary" type="submit">
                      Se connecter
                    </Button>
                  </Col>
                  <Col className="d-flex justify-content-end">
                    <Button
                      variant="outline-secondary"
                      onClick={(): ReturnType<typeof setShowNew> =>
                        setShowNew(true)
                      }
                    >
                      Créer un compte
                    </Button>
                  </Col>
                </Row>
              </Card.Footer>
            </Form>
          </Card>
        </Col>
      </Row>
      <CreateUserModal newSelf />
    </>
  );
}

export default connector(LoginView);