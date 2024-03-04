import { organizationSchema, type Organization } from '@website/shared-types';
import { Formik } from 'formik';
import { type ReactElement } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import { switchShowNewOrganization } from 'reducers/slices';
import { type AppState } from 'reducers/types';
import { client } from 'utils';
import { toFormikValidationSchema } from 'zod-formik-adapter';
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
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={values.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isInvalid={touched.name && !!errors.name}
                  placeholder="Enter name"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={values.description}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isInvalid={touched.description && !!errors.description}
                  placeholder="Enter name"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={values.location}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isInvalid={touched.location && !!errors.location}
                  placeholder="Enter content"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.location}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Website</Form.Label>
                <Form.Control
                  type="text"
                  name="website"
                  value={values.website}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isInvalid={touched.website && !!errors.website}
                  placeholder="Enter content"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.website}
                </Form.Control.Feedback>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit">Add</Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default connector(CreateOrganizationModal);
