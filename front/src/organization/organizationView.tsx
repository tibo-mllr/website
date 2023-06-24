import { ReactElement, useEffect, useState } from 'react';
import {
  FormErrors,
  Organization,
  OrganizationDocument,
  client,
} from '../utils';
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap';

type OrganizationViewProps = {
  showNew: boolean;
  setShowNew: (showNew: boolean) => void;
};

export default function OrganizationView({
  showNew,
  setShowNew,
}: OrganizationViewProps): ReactElement {
  const [organizations, setOrganizations] = useState<OrganizationDocument[]>(
    [],
  );
  const [newOrganization, setNewOrganization] = useState<Organization>({
    name: '',
    description: '',
    location: '',
    website: '',
  });
  const [newErros, setNewErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validateNewForm = (): FormErrors => {
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
  };

  const handleCreate = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);
    const errors = validateNewForm();

    if (Object.keys(errors).length) setNewErrors(errors);
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
          setShowNew(false);
        })
        .catch((error) => {
          alert(error);
          console.log(error);
        });
      setSubmitted(false);
    }
  };

  useEffect(() => {
    client
      .get('/organization')
      .then((response) => setOrganizations(response.data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    setNewErrors(validateNewForm());
  }, [newOrganization]);

  return (
    <>
      {organizations.map((organization) => (
        <Row style={{ marginBottom: '8px' }} key={organization._id}>
          <Col>
            <Card>
              <Card.Header>
                <Card.Title>
                  <b>{organization.name}</b>, {organization.location}
                </Card.Title>
              </Card.Header>
              <Card.Body>
                {organization.description ? (
                  organization.description
                ) : (
                  <i>No description provided</i>
                )}
                <br />
                <br />
                <b>Website: </b>
                <a href={organization.website}>{organization.website}</a>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ))}
      <Modal
        show={showNew}
        onHide={(): void => {
          setShowNew(false);
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
                isValid={!newErros.name && !!newOrganization.name}
                isInvalid={
                  !!newErros.name && (!!newOrganization.name || submitted)
                }
                placeholder="Enter name"
              />
              <Form.Control.Feedback type="invalid">
                {newErros.name}
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
                isValid={!newErros.description && !!newOrganization.description}
                isInvalid={
                  !!newErros.description &&
                  (!!newOrganization.description || submitted)
                }
                placeholder="Enter name"
              />
              <Form.Control.Feedback type="invalid">
                {newErros.description}
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
                isValid={!newErros.location && !!newOrganization.location}
                isInvalid={
                  !!newErros.location &&
                  (!!newOrganization.location || submitted)
                }
                placeholder="Enter content"
              />
              <Form.Control.Feedback type="invalid">
                {newErros.location}
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
                isValid={
                  !newErros.website && newOrganization.website.length > 6
                }
                isInvalid={
                  !!newErros.website &&
                  (newOrganization.website.length > 6 || submitted)
                }
                placeholder="Enter content"
              />
              <Form.Control.Feedback type="invalid">
                {newErros.website}
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Add</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
