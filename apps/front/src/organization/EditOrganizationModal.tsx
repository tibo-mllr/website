import { organizationSchema } from '@website/shared-types';
import { Formik } from 'formik';
import { type ReactElement } from 'react';
import { Modal } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import { type AppState } from 'reducers/types';
import { client } from 'utils';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import OrganizationForm from './OrganizationForm';
import { type OrganizationDocument } from './utilsOrganization';

type EditOrganizationProps = {
  organizationToEdit: OrganizationDocument;
  show: boolean;
  setShow: (show: boolean) => void;
};

const stateProps = (
  state: AppState,
): Pick<AppState['adminReducer'], 'token'> => ({
  token: state.adminReducer.token,
});

const connector = connect(stateProps);

export function EditOrganizationModal({
  organizationToEdit,
  show,
  setShow,
  token,
}: EditOrganizationProps & ConnectedProps<typeof connector>): ReactElement {
  const handleEdit = (values: OrganizationDocument): void => {
    client
      .put<OrganizationDocument>(
        `/organization/${organizationToEdit._id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(() => {
        alert('Organization edited');
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
        <Modal.Title>Edit Organization</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={organizationToEdit}
        validationSchema={toFormikValidationSchema(organizationSchema)}
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
          <OrganizationForm
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

export default connector(EditOrganizationModal);
