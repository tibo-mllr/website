import { Organization } from '@website/shared-types';
import {
  FormEvent,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { ConnectedProps, connect } from 'react-redux';
import { switchShowNewOrganization } from 'reducers/slices';
import { AppState } from 'reducers/types';
import { FormErrors, client } from 'utils';
import { OrganizationDocument } from './utilsOrganization';

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
  const [newOrganization, setNewOrganization] =
    useState<Organization>(emptyOrganization);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = useCallback((): FormErrors => {
    const errors: FormErrors = {};

    if (!newOrganization.name) errors.name = 'Name is required';
    if (!newOrganization.description)
      errors.description = 'Description is required';
    if (!newOrganization.location) errors.location = 'Location is required';
    if (!newOrganization.website) errors.website = 'Website is required';
    if (
      !newOrganization.website.startsWith('http://') &&
      !newOrganization.website.startsWith('https://')
    )
      errors.website =
        'Please enter the full URL (starting with "http://" or "https://")';

    return errors;
  }, [newOrganization]);

  const handleCreate = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);
    const errors = validateForm();

    if (Object.keys(errors).length) setErrors(errors);
    else {
      client
        .post<OrganizationDocument>('/organization', newOrganization, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          alert('Organization added');
          setNewOrganization(emptyOrganization);
          setShow(false);
        })
        .catch((error) => {
          alert(error);
          console.error(error);
        });
      setSubmitted(false);
    }
  };

  useEffect(() => {
    setErrors(validateForm());
  }, [validateForm]);

  return (
    <Modal
      show={showNew}
      onHide={(): void => {
        setShow(false);
        setSubmitted(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>New Organization</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleCreate}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={newOrganization.name}
              onChange={(event): void =>
                setNewOrganization({
                  ...newOrganization,
                  name: event.target.value,
                })
              }
              isValid={!errors.name && !!newOrganization.name}
              isInvalid={!!errors.name && (!!newOrganization.name || submitted)}
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
              value={newOrganization.description}
              onChange={(event): void =>
                setNewOrganization({
                  ...newOrganization,
                  description: event.target.value,
                })
              }
              isValid={!errors.description && !!newOrganization.description}
              isInvalid={
                !!errors.description &&
                (!!newOrganization.description || submitted)
              }
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
              value={newOrganization.location}
              onChange={(event): void =>
                setNewOrganization({
                  ...newOrganization,
                  location: event.target.value,
                })
              }
              isValid={!errors.location && !!newOrganization.location}
              isInvalid={
                !!errors.location && (!!newOrganization.location || submitted)
              }
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
              value={newOrganization.website}
              onChange={(event): void =>
                setNewOrganization({
                  ...newOrganization,
                  website: event.target.value,
                })
              }
              isValid={!errors.website && newOrganization.website.length > 6}
              isInvalid={
                !!errors.website &&
                (newOrganization.website.length > 6 || submitted)
              }
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
    </Modal>
  );
}

export default connector(CreateOrganizationModal);
