import { frontUserSchema } from '@website/shared-types';
import { useSnackbar } from 'notistack';
import { type ReactElement } from 'react';
import { Card, Modal } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import { type AppState } from 'reducers/types';
import { client } from 'utils';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import UserForm from './UserForm';
import { type FrontUserDocument } from './utilsAdmin';

type EditUserProps = {
  userToEdit: FrontUserDocument;
  show: boolean;
  setShow: (show: boolean) => void;
};

const stateProps = (
  state: AppState,
): Pick<AppState['adminReducer'], 'token' | 'userRole'> => ({
  token: state.adminReducer.token,
  userRole: state.adminReducer.userRole,
});

const connector = connect(stateProps);

export function EditUserModal({
  userToEdit,
  show,
  setShow,
  token,
  userRole,
}: EditUserProps & ConnectedProps<typeof connector>): ReactElement {
  const { enqueueSnackbar } = useSnackbar();
  const handleEdit = (values: FrontUserDocument): void => {
    client
      .put(`/user/${userToEdit._id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        enqueueSnackbar('User edited', { variant: 'success' });
        setShow(false);
      })
      .catch((error) => {
        enqueueSnackbar(error, { variant: 'error' });
        console.error(error);
      });
  };

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Card.Title>Edit user</Card.Title>
      </Modal.Header>
      <UserForm
        initialValues={userToEdit}
        validationSchema={toFormikValidationSchema(
          frontUserSchema.omit({ password: true }).extend({
            password: frontUserSchema.shape.password.optional(),
          }),
        )}
        onSubmit={handleEdit}
        token={token}
        userRole={userRole}
        edit
      />
    </Modal>
  );
}

export default connector(EditUserModal);
