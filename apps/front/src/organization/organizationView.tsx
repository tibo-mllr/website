import { binIcon, editIcon } from 'assets';
import { ReactElement, useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { client, socket } from 'utils';
import CreateOrganization from './createOrganization';
import EditOrganization from './editOrganization';
import { OrganizationDocument } from './utilsOrganization';

type OrganizationViewProps = {
  showNew: boolean;
  setShowNew: (showNew: boolean) => void;
};

export function OrganizationView({
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
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    client
      .get('/organization')
      .then((response) => setOrganizations(response.data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    socket.on('organizationAdded', (newOrganization: OrganizationDocument) =>
      setOrganizations([...organizations, newOrganization]),
    );
    socket.on(
      'organizationEdited',
      (editedOrganization: OrganizationDocument) =>
        setOrganizations(
          organizations.map((organization) =>
            organization._id === editedOrganization._id
              ? editedOrganization
              : organization,
          ),
        ),
    );
    socket.on('organizationDeleted', (id: string) =>
      setOrganizations(
        organizations.filter((organization) => organization._id !== id),
      ),
    );
    return () => {
      socket.off('organizationAdded');
      socket.off('organizationEdited');
      socket.off('organizationDeleted');
    };
  }, [organizations]);

  return (
    <>
      <Row>
        <h1 style={{ textAlign: 'center' }}>
          These are the organizations I worked for
        </h1>
      </Row>
      {organizations.length ? (
        organizations.map((organization) => (
          <Row style={{ marginBottom: '8px' }} key={organization._id}>
            <Col>
              <Card>
                <Card.Header>
                  <Card.Title>
                    <b>{organization.name}</b>, {organization.location}
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  {organization.description ?? <i>No description provided</i>}
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
        ))
      ) : (
        <i>No organization to display</i>
      )}
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

export default OrganizationView;
