'use client';

import { Card, CardHeader, Modal } from '@mui/material';
import { useState, type ReactElement } from 'react';
import { useSelector } from 'react-redux';

import { PartialBy, ProjectType } from '@website/shared-types';

import { useNotification } from '@/components/NotificationProvider';
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

  const { notify } = useNotification();

  const handleCreate = async (
    newProject: PartialBy<Project, 'organization'>,
  ): Promise<void> => {
    const organizationId = await handleOrganization(
      organizations,
      notify,
      newProject.organization,
    );

    API.createProject({
      ...newProject,
      organization: organizationId,
      endDate: selectEndDate ? newProject.endDate : undefined,
    })
      .then(() => {
        notify('Project added', { severity: 'success' });
        dispatch(switchShowNewProject(false));
      })
      .catch((error) => {
        notify(error, { severity: 'error' });
        console.error(error);
      });
  };

  return (
    <Modal open={showNew} onClose={() => dispatch(switchShowNewProject(false))}>
      <Card>
        <CardHeader title="New project" closeButton />
        <ProjectForm
          selectEndDate={selectEndDate}
          setSelectEndDate={setSelectEndDate}
          create
          initialValues={emptyProject}
          onSubmit={handleCreate}
        />
      </Card>
    </Modal>
  );
}
