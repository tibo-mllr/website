'use client';

import { useSnackbar } from 'notistack';
import { type ReactElement } from 'react';
import { Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { type Organization } from '@website/shared-types';

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

  const { enqueueSnackbar } = useSnackbar();

  const handleCreate = (newOrganization: Organization): void => {
    API.createOrganization(newOrganization)
      .then(() => {
        enqueueSnackbar('Organization added', { variant: 'success' });
        dispatch(switchShowNewOrganization(false));
      })
      .catch((error) => {
        enqueueSnackbar(error, { variant: 'error' });
        console.error(error);
      });
  };

  return (
    <Modal
      show={showNew}
      onHide={() => dispatch(switchShowNewOrganization(false))}
    >
      <Modal.Header closeButton>
        <Modal.Title>New Organization</Modal.Title>
      </Modal.Header>
      <OrganizationForm
        create
        initialValues={emptyOrganization}
        onSubmit={handleCreate}
      />
    </Modal>
  );
}
