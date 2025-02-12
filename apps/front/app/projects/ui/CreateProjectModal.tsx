'use client';

import { useSnackbar } from 'notistack';
import { useState, type ReactElement } from 'react';
import { Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { PartialBy, ProjectType } from '@website/shared-types';

import { API } from '@/lib/api';
import { useAppDispatch } from '@/lib/redux/hooks';
import {
  selectOrganizations,
  selectShowNewProject,
  switchShowNewProject,
} from '@/lib/redux/slices';
import { handleOrganization, type Project } from '@/lib/utils';

import { ProjectForm } from './ProjectForm';

export default function CreateProjectModal(): ReactElement {
  const emptyProject: Project = {
    role: '',
    title: '',
    description: '',
    competencies: [],
    link: undefined,
    type: ProjectType.Education,
    organization: {
      _id: '',
      name: '',
      description: '',
      location: '',
      website: '',
    },
    startDate: new Date(),
    endDate: undefined,
  };
  const [selectEndDate, setSelectEndDate] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const organizations = useSelector(selectOrganizations);
  const showNew = useSelector(selectShowNewProject);

  const { enqueueSnackbar } = useSnackbar();

  const handleCreate = async (
    newProject: PartialBy<Project, 'organization'>,
  ): Promise<void> => {
    const organizationId = await handleOrganization(
      organizations,
      enqueueSnackbar,
      newProject.organization,
    );

    API.createProject({
      ...newProject,
      organization: organizationId,
      endDate: selectEndDate ? newProject.endDate : undefined,
    })
      .then(() => {
        enqueueSnackbar('Project added', { variant: 'success' });
        dispatch(switchShowNewProject(false));
      })
      .catch((error) => {
        enqueueSnackbar(error, { variant: 'error' });
        console.error(error);
      });
  };

  return (
    <Modal
      show={showNew}
      onHide={() => dispatch(switchShowNewProject(false))}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>New project</Modal.Title>
      </Modal.Header>
      <ProjectForm
        selectEndDate={selectEndDate}
        setSelectEndDate={setSelectEndDate}
        create
        initialValues={emptyProject}
        onSubmit={handleCreate}
      />
    </Modal>
  );
}
