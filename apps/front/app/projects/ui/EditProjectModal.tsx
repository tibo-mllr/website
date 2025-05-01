'use client';

import { Box, Card, CardHeader, Modal } from '@mui/material';
import { useEffect, useState, type ReactElement } from 'react';

import { useNotification } from '@/components';
import { API } from '@/lib/api';
import {
  handleOrganization,
  OrganizationDocument,
  Project,
  type ProjectDocument,
} from '@/lib/utils';

import { ProjectForm } from './ProjectForm';

type EditProjectProps = {
  projectToEdit: ProjectDocument;
  show: boolean;
  setShow: (show: boolean) => void;
};

export default function EditProjectModal({
  projectToEdit,
  show,
  setShow,
}: EditProjectProps): ReactElement {
  const [selectEndDate, setSelectEndDate] = useState<boolean>(
    !!projectToEdit.endDate,
  );
  const [organizations, setOrganizations] = useState<OrganizationDocument[]>(
    [],
  );

  const { notify } = useNotification();

  const handleEdit = async (values: Project): Promise<void> => {
    const changes = values;
    if (!changes.link) delete changes.link;

    const organizationId = await handleOrganization(
      organizations,
      notify,
      changes.organization,
    );

    API.editProject(projectToEdit._id, {
      ...changes,
      organization: organizationId,
      endDate: selectEndDate ? changes.endDate : undefined,
    })
      .then(() => {
        notify('Project edited', { severity: 'success' });
        setShow(false);
      })
      .catch((error) => {
        notify(error, { severity: 'error' });
        console.error(error);
      });
  };

  useEffect(() => {
    API.getOrganizations().then(setOrganizations);
  }, []);

  return (
    <Modal open={show} onClose={() => setShow(false)}>
      <Box
        padding={2}
        width="70vw"
        minWidth={300}
        maxHeight="100vh"
        overflow="auto"
        position="absolute"
        left="50%"
        sx={{ transform: 'translate(-50%, 0)' }}
      >
        <Card>
          <CardHeader title="Edit project" />

          <ProjectForm
            selectEndDate={selectEndDate}
            setSelectEndDate={setSelectEndDate}
            organization={projectToEdit.organization}
            edit
            initialValues={{
              ...projectToEdit,
              startDate: new Date(projectToEdit.startDate),
              endDate: projectToEdit.endDate
                ? new Date(projectToEdit.endDate)
                : undefined,
              organization: projectToEdit.organization ?? {
                _id: '',
                name: '',
                description: '',
                location: '',
                website: '',
              },
              link: projectToEdit.link ?? '',
            }}
            onSubmit={handleEdit}
            organizations={organizations}
          />
        </Card>
      </Box>
    </Modal>
  );
}
