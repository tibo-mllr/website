import { organizationSchema, type Organization } from '@website/shared-types';
import { Formik } from 'formik';
import { type ReactElement } from 'react';
import { Modal } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import { switchShowNewOrganization } from 'reducers/slices';
import { type AppState } from 'reducers/types';
import { client } from 'utils';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import OrganizationForm from './OrganizationForm';
import { type OrganizationDocument } from './utilsOrganization';

const stateProps = (
  state: AppState,
): Pick<
  AppState['organizationReducer'] & AppState['adminReducer'],
  'showNew' | 'token'
> => ({
  showNew: state.organizationReducer.showNew,
  token: state.adminReducer.token,
});

const dispatchProps = {
  setShow: switchShowNewOrganization,
};

const connector = connect(stateProps, dispatchProps);

export function CreateOrganizationModal({
  showNew,
  token,
  setShow,
}: ConnectedProps<typeof connector>): ReactElement {
  const emptyOrganization: Organization = {
    name: '',
    description: '',
    location: '',
    website: '',
  };

  const handleCreate = (newOrganization: Organization): void => {
    client
      .post<OrganizationDocument>('/organization', newOrganization, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert('Organization added');
        setShow(false);
      })
      .catch((error) => {
        alert(error);
        console.error(error);
      });
  };

  return (
    <Modal show={showNew} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>New Organization</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={emptyOrganization}
        validationSchema={toFormikValidationSchema(organizationSchema)}
        onSubmit={handleCreate}
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
            create
          />
        )}
      </Formik>
    </Modal>
  );
}

export default connector(CreateOrganizationModal);
