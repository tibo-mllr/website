'use client';

import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { useEffect, useState, type ReactElement } from 'react';
import { useSelector } from 'react-redux';

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
        <Typography textAlign="center" variant="h4" component="h1">
          These are the organizations I worked for
        </Typography>
      </Grid>
      <CustomSuspense
        fallback={<OrganizationCardSkeleton />}
        count={2}
        isLoading={isLoading}
      >
        {organizations.length ? (
          organizations.map((organization) => (
            <Card className="my-3" key={organization._id}>
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
                <a href={organization.website} target="_blank" rel="noreferrer">
                  {organization.website}
                </a>
              </CardContent>
              {!!token && userRole === 'superAdmin' && (
                <CardActions>
                  <Grid container justifyContent="end" width="100%">
                    <IconButton
                      aria-label="Edit"
                      onClick={() => {
                        setShowEdit(true);
                        setOrganizationToEdit(organization);
                      }}
                      color="warning"
                    >
                      <EditTwoToneIcon />
                    </IconButton>
                    <IconButton
                      aria-label="Delete"
                      onClick={() => {
                        setShowConfirm(true);
                        setOrganizationToEdit(organization);
                      }}
                      color="error"
                    >
                      <DeleteForeverTwoToneIcon />
                    </IconButton>
                  </Grid>
                </CardActions>
              )}
            </Card>
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
