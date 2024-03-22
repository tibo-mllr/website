import {
  type FrontUser,
  UserRole,
  frontUserSchema,
} from '@website/shared-types';
import { useSnackbar } from 'notistack';
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
): Pick<AppState['adminReducer'], 'showNew' | 'token' | 'userRole'> => ({
  showNew: state.adminReducer.showNew,
  token: state.adminReducer.token,
  userRole: state.adminReducer.userRole,
});

const dispatchProps = { setShow: switchShowNewUser };

const connector = connect(stateProps, dispatchProps);

export function CreateUserModal({
  showNew,
  setShow,
  token,
  userRole,
  newSelf = false,
}: CreateUserProps & ConnectedProps<typeof connector>): ReactElement {
  const emptyUser: FrontUser = {
    username: '',
    password: '',
    role: UserRole.Admin,
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleCreate = (newUser: FrontUser): void => {
    client
      .post<FrontUserDocument>(`/user${newSelf ? '/new' : ''}`, newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        enqueueSnackbar(newSelf ? 'Account created' : 'User added', {
          variant: 'success',
        });
        setShow(false);
      })
      .catch((error) => {
        if (error.response?.status === 409)
          enqueueSnackbar('Username already exists', { variant: 'error' });
        else {
          enqueueSnackbar(error, { variant: 'error' });
          console.error(error);
        }
      });
  };

  return (
    <Modal show={showNew} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Card.Title>New user</Card.Title>
      </Modal.Header>
      <UserForm
        initialValues={emptyUser}
        onSubmit={async (values) => {
          handleCreate(values);
        }}
        validationSchema={toFormikValidationSchema(frontUserSchema)}
        token={token}
        userRole={userRole}
        create
      />
    </Modal>
  );
}

export default connector(CreateUserModal);
