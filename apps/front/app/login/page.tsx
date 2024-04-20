'use client';

import { PasswordField, TextFieldWithLabel } from '@/components';
import { login, switchShowNewUser } from '@/lib/redux/slices';
import { DOCUMENT_TITLE, client } from '@/lib/utils';
import { type UserRole } from '@website/shared-types';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { type ReactElement, useEffect } from 'react';
import { Button, Col, Row, Card, Form } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import { CreateUserModal } from '../admin';

const dispatchProps = { login, setShowNew: switchShowNewUser };

const connector = connect(null, dispatchProps);

export function LoginView({
  login,
  setShowNew,
}: ConnectedProps<typeof connector>): ReactElement {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

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
        router.push('/admin');
      })
      .catch((error) => {
        enqueueSnackbar('Erreur de connexion', { variant: 'error' });
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
                      autoComplete="username"
                    />
                    <PasswordField
                      name="password"
                      placeholder="Enter password"
                      groupClassName="mb-3"
                      autoComplete="current-password"
                    />
                  </Card.Body>
                  <Card.Footer>
                    <Row>
                      <Col>
                        <Button type="submit">Connect</Button>
                      </Col>
                      <Col className="d-flex justify-content-end">
                        <Button onClick={() => setShowNew(true)}>
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
