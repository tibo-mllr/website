import {
  FormEvent,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { FormErrors, client } from 'utils';
import { OrganizationDocument } from './utilsOrganization';

type EditOrganizationProps = {
  organizationToEdit: OrganizationDocument;
  setOrganizationToEdit: (organizationToEdit: OrganizationDocument) => void;
  show: boolean;
  setShow: (show: boolean) => void;
  organizations: OrganizationDocument[];
  setOrganizations: (organizations: OrganizationDocument[]) => void;
};

export function EditOrganization({
  organizationToEdit,
  setOrganizationToEdit,
  show,
  setShow,
  organizations,
  setOrganizations,
}: EditOrganizationProps): ReactElement {
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const validateForm = useCallback((): FormErrors => {
    const errors: FormErrors = {};

    if (!organizationToEdit.name) errors.name = 'Name is required';
    if (!organizationToEdit.description)
      errors.description = 'Description is required';
    if (!organizationToEdit.location) errors.location = 'Location is required';
    if (!organizationToEdit.website) errors.website = 'Website is required';
    if (
      !organizationToEdit.website.startsWith('http://') &&
      !organizationToEdit.website.startsWith('https://')
    )
      errors.website =
        'Please enter the full URL (starting with "http://" or "https://")';

    return errors;
  }, [organizationToEdit]);

  const handleEdit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);
    const errors = validateForm();

    if (Object.keys(errors).length) setErrors(errors);
    else {
      client
        .put(`/organization/${organizationToEdit._id}`, organizationToEdit, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('loginToken')}`,
          },
        })
        .then((response) => {
          alert('Organization edited');
          setOrganizations(
            organizations.map((organization) =>
              organization._id === response.data._id
                ? response.data
                : organization,
            ),
          );
          setOrganizationToEdit({
            _id: '',
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

  useEffect(() => {
    setErrors(validateForm());
  }, [validateForm]);

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
      <Form onSubmit={handleEdit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={organizationToEdit.name}
              onChange={(event): void =>
                setOrganizationToEdit({
                  ...organizationToEdit,
                  name: event.target.value,
                })
              }
              isValid={!errors.name && !!organizationToEdit.name}
              isInvalid={
                !!errors.name && (!!organizationToEdit.name || submitted)
              }
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
              value={organizationToEdit.description}
              onChange={(event): void =>
                setOrganizationToEdit({
                  ...organizationToEdit,
                  description: event.target.value,
                })
              }
              isValid={!errors.description && !!organizationToEdit.description}
              isInvalid={
                !!errors.description &&
                (!!organizationToEdit.description || submitted)
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
              value={organizationToEdit.location}
              onChange={(event): void =>
                setOrganizationToEdit({
                  ...organizationToEdit,
                  location: event.target.value,
                })
              }
              isValid={!errors.location && !!organizationToEdit.location}
              isInvalid={
                !!errors.location &&
                (!!organizationToEdit.location || submitted)
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
              value={organizationToEdit.website}
              onChange={(event): void =>
                setOrganizationToEdit({
                  ...organizationToEdit,
                  website: event.target.value,
                })
              }
              isValid={!errors.website && organizationToEdit.website.length > 6}
              isInvalid={
                !!errors.website &&
                (organizationToEdit.website.length > 6 || submitted)
              }
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
    </Modal>
  );
}

export default EditOrganization;
