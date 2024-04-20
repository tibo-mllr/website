'use client';

import { binIcon, editIcon } from '@/app/ui/assets';
import { ConfirmModal } from '@/components';
import { fetchOrganizations } from '@/lib/redux/actions';
import {
  addOrganization,
  deleteOrganization,
  editOrganization,
} from '@/lib/redux/slices';
import { type AppState } from '@/lib/redux/types';
import {
  DOCUMENT_TITLE,
  client,
  socket,
  type OrganizationDocument,
} from '@/lib/utils';
import Image from 'next/image';
import { useSnackbar } from 'notistack';
import { type ReactElement, useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import { CreateOrganizationModal, EditOrganizationModal } from './ui';

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
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [organizationToEdit, setOrganizationToEdit] =
    useState<OrganizationDocument>({
      _id: '',
      name: '',
      location: '',
      description: '',
      website: '',
    });

  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = (id: string): void => {
    client
      .delete(`/organization/${id}`)
      .then(() =>
        enqueueSnackbar('Organization deleted', { variant: 'success' }),
      )
      .catch((error) => {
        enqueueSnackbar('Error deleting organization', { variant: 'error' });
        console.error(error);
      });
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
      <ConfirmModal
        title="Delete organization"
        message="Are you sure you want to delete this organization?"
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => handleDelete(organizationToEdit._id)}
      />
      <Row>
        <h1 className="text-center">
          These are the organizations I worked for
        </h1>
      </Row>
      {organizations.length ? (
        organizations.map((organization) => (
          <Row className="my-3" key={organization._id}>
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
                  <a href={organization.website} target="_blank">
                    {organization.website}
                  </a>
                </Card.Body>
                {!!token && userRole === 'superAdmin' && (
                  <Card.Footer>
                    <Row>
                      <Col className="d-flex justify-content-end gap-2">
                        <Button
                          onClick={() => {
                            setShowEdit(true);
                            setOrganizationToEdit(organization);
                          }}
                        >
                          <Image
                            alt="Edit"
                            src={editIcon}
                            height="24"
                            className="d-inline-block align-center"
                          />
                        </Button>
                        <Button
                          onClick={() => {
                            setShowConfirm(true);
                            setOrganizationToEdit(organization);
                          }}
                        >
                          <Image
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
          show={showEdit}
          setShow={setShowEdit}
        />
      )}
    </>
  );
}

export default connector(OrganizationView);
