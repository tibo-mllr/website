import {
  type FrontUser,
  UserRole,
  frontUserSchema,
} from '@website/shared-types';
import { Formik } from 'formik';
import { type ReactElement } from 'react';
import { Card, Modal } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import { switchShowNewUser } from 'reducers/slices';
import { type AppState } from 'reducers/types';
import { client } from 'utils';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import UserForm from './UserForm';
import { type FrontUserDocument } from './utilsAdmin';

type CreateUserProps = {
  newSelf?: boolean;
};

const stateProps = (
  state: AppState,
): Pick<AppState['adminReducer'], 'showNew' | 'token'> => ({
  showNew: state.adminReducer.showNew,
  token: state.adminReducer.token,
});

const dispatchProps = { setShow: switchShowNewUser };

const connector = connect(stateProps, dispatchProps);

export function CreateUserModal({
  showNew,
  setShow,
  token,
  newSelf = false,
}: CreateUserProps & ConnectedProps<typeof connector>): ReactElement {
  const emptyUser: FrontUser = {
    username: '',
    password: '',
    role: UserRole.Admin,
  };

  const handleCreate = (newUser: FrontUser): void => {
    client
      .post<FrontUserDocument>(`/user${newSelf ? '/new' : ''}`, newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert(newSelf ? 'Account created' : 'User added');
        setShow(false);
      })
      .catch((error) => {
        if (error.response.status === 409) alert('Username already used');
        else {
          alert(error);
          console.error(error);
        }
      });
  };

  return (
    <Modal show={showNew} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Card.Title>New user</Card.Title>
      </Modal.Header>
      <Formik
        initialValues={emptyUser}
        onSubmit={async (values) => {
          handleCreate(values);
        }}
        validationSchema={toFormikValidationSchema(frontUserSchema)}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <UserForm
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            handleSubmit={handleSubmit}
            create
          />
        )}
      </Formik>
    </Modal>
  );
}

export default connector(CreateUserModal);
