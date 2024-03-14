import { frontUserSchema } from '@website/shared-types';
import { Formik } from 'formik';
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
): Pick<AppState['adminReducer'], 'token'> => ({
  token: state.adminReducer.token,
});

const connector = connect(stateProps);

export function EditUserModal({
  userToEdit,
  show,
  setShow,
  token,
}: EditUserProps & ConnectedProps<typeof connector>): ReactElement {
  const handleEdit = (values: FrontUserDocument): void => {
    client
      .put(`/user/${userToEdit._id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert('User edited');
        setShow(false);
      })
      .catch((error) => {
        alert(error);
        console.error(error);
      });
  };

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Card.Title>Edit user</Card.Title>
      </Modal.Header>
      <Formik
        initialValues={userToEdit}
        validationSchema={toFormikValidationSchema(
          frontUserSchema.omit({ password: true }).extend({
            password: frontUserSchema.shape.password.optional(),
          }),
        )}
        onSubmit={handleEdit}
      >
        {({
          values,
          touched,
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <UserForm
            values={values}
            touched={touched}
            errors={errors}
            handleBlur={handleBlur}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            edit
          />
        )}
      </Formik>
    </Modal>
  );
}

export default connector(EditUserModal);
