import { organizationSchema } from '@website/shared-types';
import { Formik } from 'formik';
import { type ReactElement } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import { type AppState } from 'reducers/types';
import { client } from 'utils';
import { toFormikValidationSchema } from 'zod-formik-adapter';
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
    <Modal show={show} onHide={(): void => setShow(false)}>
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
              <Button type="submit">Edit</Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default connector(EditOrganizationModal);
