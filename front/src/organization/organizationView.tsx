import { ReactElement, useEffect, useState } from 'react';
import { client } from '../utils';
import { OrganizationDocument } from './utilsOrganization';
import { Button, Card, Col, Row } from 'react-bootstrap';
import CreateOrganization from './createOrganization';
import EditOrganization from './editOrganization';
import editIcon from '../assets/editIcon.png';
import binIcon from '../assets/binIcon.png';

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
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [organizationToEdit, setOrganizationToEdit] =
    useState<OrganizationDocument>({
      _id: '',
      name: '',
      location: '',
      description: '',
      website: '',
    });

  const handleDelete = (id: string): void => {
    client
      .delete(`/organization/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('loginToken')}`,
        },
      })
      .then(() =>
        setOrganizations(
          organizations.filter((organization) => organization._id !== id),
        ),
      )
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    client
      .get('/organization')
      .then((response) => setOrganizations(response.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <Row>
        <h1 style={{ textAlign: 'center' }}>
          These are the organizations I worked for
        </h1>
      </Row>
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
              {sessionStorage.getItem('loginToken') &&
                sessionStorage.getItem('role') === 'superAdmin' && (
                  <Card.Footer>
                    <Row>
                      <Col className="d-flex justify-content-end">
                        <Button
                          onClick={(): void => {
                            setShowEdit(true);
                            setOrganizationToEdit(organization);
                          }}
                          style={{
                            marginRight: '8px',
                          }}
                        >
                          <img
                            alt="Edit"
                            src={editIcon}
                            height="24"
                            className="d-inline-block align-center"
                          />
                        </Button>
                        <Button
                          onClick={(): void => handleDelete(organization._id)}
                        >
                          <img
                            alt="Delete"
                            src={binIcon}
                            height="24"
                            className="d-inline-block align-center"
                          />
                        </Button>
                      </Col>
                    </Row>
                  </Card.Footer>
                )}
            </Card>
          </Col>
        </Row>
      ))}
      {sessionStorage.getItem('loginToken') && (
        <CreateOrganization
          show={showNew}
          setShow={setShowNew}
          organizations={organizations}
          setOrganizations={setOrganizations}
        />
      )}
      {sessionStorage.getItem('loginToken') &&
        sessionStorage.getItem('role') === 'superAdmin' && (
          <EditOrganization
            organizationToEdit={organizationToEdit}
            setOrganizationToEdit={setOrganizationToEdit}
            show={showEdit}
            setShow={setShowEdit}
            organizations={organizations}
            setOrganizations={setOrganizations}
          />
        )}
    </>
  );
}
