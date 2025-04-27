'use client';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
} from '@mui/material';
import Image from 'next/image';
import { useEffect, useState, type ReactElement } from 'react';
import { useSelector } from 'react-redux';

import { binIcon, editIcon } from '@/app/ui/assets';
import {
  ConfirmModal,
  CustomSuspense,
  OrganizationCardSkeleton,
} from '@/components';
import { useNotification } from '@/components/NotificationProvider';
import { API } from '@/lib/api';
import { fetchOrganizations } from '@/lib/redux/actions';
import { useAppDispatch } from '@/lib/redux/hooks';
import {
  addOrganization,
  deleteOrganization,
  editOrganization,
  selectOrganizations,
  selectOrganizationsLoading,
  selectToken,
  selectUserRole,
} from '@/lib/redux/slices';
import { type OrganizationDocument } from '@/lib/utils';

import { CreateOrganizationModal, EditOrganizationModal } from './ui';

export default function OrganizationView(): ReactElement {
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

  const dispatch = useAppDispatch();
  const token = useSelector(selectToken);
  const userRole = useSelector(selectUserRole);
  const isLoading = useSelector(selectOrganizationsLoading);
  const organizations = useSelector(selectOrganizations);

  const { notify } = useNotification();

  const handleDelete = (id: string): void => {
    API.deleteOrganization(id)
      .then(() => notify('Organization deleted', { severity: 'success' }))
      .catch((error) => {
        notify('Error deleting organization', { severity: 'error' });
        console.error(error);
      });
  };

  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);

  useEffect(() => {
    API.listenTo('organizationAdded', (newOrganization: OrganizationDocument) =>
      dispatch(addOrganization(newOrganization)),
    );
    API.listenTo(
      'organizationEdited',
      (editedOrganization: OrganizationDocument) =>
        dispatch(editOrganization(editedOrganization)),
    );
    API.listenTo('organizationDeleted', (id: string) =>
      dispatch(deleteOrganization(id)),
    );
    return () => {
      API.stopListening('organizationAdded');
      API.stopListening('organizationEdited');
      API.stopListening('organizationDeleted');
    };
  }, [dispatch]);

  return (
    <>
      <ConfirmModal
        title="Delete organization"
        message="Are you sure you want to delete this organization?"
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => handleDelete(organizationToEdit._id)}
      />
      <Grid>
        <h1 className="text-center">
          These are the organizations I worked for
        </h1>
      </Grid>
      <CustomSuspense
        fallback={<OrganizationCardSkeleton />}
        count={2}
        isLoading={isLoading}
      >
        {organizations.length ? (
          organizations.map((organization) => (
            <Grid className="my-3" key={organization._id}>
              <Grid>
                <Card>
                  <CardHeader
                    title={
                      <>
                        <b>{organization.name}</b>, {organization.location}
                      </>
                    }
                  />
                  <CardContent>
                    {organization.description ?? <i>No description provided</i>}
                    <br />
                    <br />
                    <b>Website: </b>
                    <a
                      href={organization.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {organization.website}
                    </a>
                  </CardContent>
                  {!!token && userRole === 'superAdmin' && (
                    <CardActions>
                      <Grid>
                        <Grid className="d-flex justify-content-end gap-2">
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
                        </Grid>
                      </Grid>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            </Grid>
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
      </CustomSuspense>
    </>
  );
}
