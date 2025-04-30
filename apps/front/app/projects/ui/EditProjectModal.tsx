'use client';

import { Box, Card, CardHeader, Modal } from '@mui/material';
import { useState, type ReactElement } from 'react';
import { useSelector } from 'react-redux';

import { useNotification } from '@/components';
import { API } from '@/lib/api';
import { selectOrganizations } from '@/lib/redux/slices';
import { handleOrganization, Project, type ProjectDocument } from '@/lib/utils';

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

  const { notify } = useNotification();

  const organizations = useSelector(selectOrganizations);

  const handleEdit = async (values: Project): Promise<void> => {
    const organizationId = await handleOrganization(
      organizations,
      notify,
      values.organization,
    );

    API.editProject(projectToEdit._id, {
      ...values,
      organization: organizationId,
      endDate: selectEndDate ? values.endDate : undefined,
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
          />
        </Card>
      </Box>
    </Modal>
  );
}
