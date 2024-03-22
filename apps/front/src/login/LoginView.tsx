import { type UserRole } from '@website/shared-types';
import { CreateUserModal } from 'admin';
import { PasswordField, TextFieldWithLabel } from 'components';
import { Formik } from 'formik';
import { type ReactElement, useEffect } from 'react';
import { Button, Col, Row, Card, Form } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, switchShowNewUser } from 'reducers/slices';
import { DOCUMENT_TITLE, client } from 'utils';

const dispatchProps = { login, setShowNew: switchShowNewUser };

const connector = connect(null, dispatchProps);

export function LoginView({
  login,
  setShowNew,
}: ConnectedProps<typeof connector>): ReactElement {
  const navigate = useNavigate();

  const handleSignIn = (values: {
    username: string;
    password: string;
  }): void => {
    client
      .post<{ access_token: string; role: UserRole }>('/auth/login/', {
        username: values.username,
        password: values.password,
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
            <Formik
              initialValues={{ username: '', password: '' }}
              validate={(values) => {
                const errors: Record<string, string> = {};

                if (!values.username) {
                  errors.username = 'Required';
                }
                if (!values.password) {
                  errors.password = 'Required';
                }
                return errors;
              }}
              onSubmit={handleSignIn}
            >
              {({ handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                  <Card.Body>
                    <TextFieldWithLabel
                      name="username"
                      label="Username"
                      placeholder="Enter username"
                    />
                    <PasswordField
                      name="password"
                      label="Password"
                      placeholder="Enter password"
                      groupClassName="mb-3"
                    />
                  </Card.Body>
                  <Card.Footer>
                    <Row>
                      <Col>
                        <Button variant="outline-secondary" type="submit">
                          Connect
                        </Button>
                      </Col>
                      <Col className="d-flex justify-content-end">
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowNew(true)}
                        >
                          Create account
                        </Button>
                      </Col>
                    </Row>
                  </Card.Footer>
                </Form>
              )}
            </Formik>
          </Card>
        </Col>
      </Row>
      <CreateUserModal newSelf />
    </>
  );
}

export default connector(LoginView);
