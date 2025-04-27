'use client';

import { Card, CardHeader, Modal } from '@mui/material';
import { type ReactElement } from 'react';
import { useSelector } from 'react-redux';

import { type Organization } from '@website/shared-types';

import { useNotification } from '@/components/NotificationProvider';
import { API } from '@/lib/api';
import { useAppDispatch } from '@/lib/redux/hooks';
import {
  selectShowNewOrganization,
  switchShowNewOrganization,
} from '@/lib/redux/slices';

import OrganizationForm from './OrganizationForm';

export default function CreateOrganizationModal(): ReactElement {
  const emptyOrganization: Organization = {
    name: '',
    description: '',
    location: '',
    website: '',
  };

  const dispatch = useAppDispatch();
  const showNew = useSelector(selectShowNewOrganization);

  const { notify } = useNotification();

  const handleCreate = (newOrganization: Organization): void => {
    API.createOrganization(newOrganization)
      .then(() => {
        notify('Organization added', { severity: 'success' });
        dispatch(switchShowNewOrganization(false));
      })
      .catch((error) => {
        notify(error, { severity: 'error' });
        console.error(error);
      });
  };

  return (
    <Modal
      open={showNew}
      onClose={() => dispatch(switchShowNewOrganization(false))}
    >
      <Card>
        <CardHeader title="New organization" closeButton />
        <OrganizationForm
          create
          initialValues={emptyOrganization}
          onSubmit={handleCreate}
        />
      </Card>
    </Modal>
  );
}
