import { binIcon, editIcon } from 'assets';
import { ReactElement, useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { ConnectedProps, connect } from 'react-redux';
import { fetchOrganizations } from 'reducers/actions';
import {
  addOrganization,
  deleteOrganization,
  editOrganization,
} from 'reducers/slices';
import { AppState } from 'reducers/types';
import { DOCUMENT_TITLE, client, socket } from 'utils';
import CreateOrganizationModal from './CreateOrganizationModal';
import EditOrganizationModal from './EditOrganizationModal';
import { OrganizationDocument } from './utilsOrganization';

const stateProps = (
  state: AppState,
): Pick<
  AppState['organizationReducer'] & AppState['adminReducer'],
  'organizations' | 'isLoading' | 'token' | 'userRole'
> => ({
  organizations: state.organizationReducer.organizations,
  isLoading: state.organizationReducer.isLoading,
  token: state.adminReducer.token,
  userRole: state.adminReducer.userRole,
});

const dispatchProps = {
  addOrganization,
  deleteOrganization,
  editOrganization,
  fetchOrganizations,
};

const connector = connect(stateProps, dispatchProps);

export function OrganizationView({
  organizations,
  isLoading,
  token,
  userRole,
  addOrganization,
  deleteOrganization,
  editOrganization,
  fetchOrganizations,
}: ConnectedProps<typeof connector>): ReactElement {
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
    const confirm = window.confirm(
      'Are you sure you want to delete this organization and its linked projects ?',
    );
    if (confirm) {
      client
        .delete(`/organization/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .catch((error) => console.error(error));
    }
  };

  useEffect(() => {
    document.title = `Organizations | ${DOCUMENT_TITLE}`;
  }, []);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  useEffect(() => {
    socket.on('organizationAdded', (newOrganization: OrganizationDocument) =>
      addOrganization(newOrganization),
    );
    socket.on(
      'organizationEdited',
      (editedOrganization: OrganizationDocument) =>
        editOrganization(editedOrganization),
    );
    socket.on('organizationDeleted', (id: string) => deleteOrganization(id));
    return () => {
      socket.off('organizationAdded');
      socket.off('organizationEdited');
      socket.off('organizationDeleted');
    };
  }, [organizations, addOrganization, deleteOrganization, editOrganization]);

  if (isLoading) return <i>Loading...</i>;

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
                {!!token && userRole === 'superAdmin' && (
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
      {!!token && <CreateOrganizationModal />}
      {!!token && userRole === 'superAdmin' && (
        <EditOrganizationModal
          organizationToEdit={organizationToEdit}
          setOrganizationToEdit={setOrganizationToEdit}
          show={showEdit}
          setShow={setShowEdit}
        />
      )}
    </>
  );
}

export default connector(OrganizationView);
