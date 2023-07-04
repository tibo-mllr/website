import { FormEvent, ReactElement, useCallback, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { FormErrors, client } from '../utils';
import { Organization, OrganizationDocument } from './utilsOrganization';

export type CreateOrganizationProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  organizations: OrganizationDocument[];
  setOrganizations: (organizations: OrganizationDocument[]) => void;
};

export default function CreateOrganization({
  show,
  setShow,
  organizations,
  setOrganizations,
}: CreateOrganizationProps): ReactElement {
  const [newOrganization, setNewOrganization] = useState<Organization>({
    name: '',
    description: '',
    location: '',
    website: '',
  });
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
        .post('/organization', newOrganization, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('loginToken')}`,
          },
        })
        .then((response) => {
          alert('Organization added');
          setOrganizations([...organizations, response.data]);
          setNewOrganization({
            name: '',
            description: '',
            location: '',
            website: '',
          });
          setShow(false);
        })
        .catch((error) => {
          alert(error);
          console.log(error);
        });
      setSubmitted(false);
    }
  };

  return (
    <Modal
      show={show}
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
