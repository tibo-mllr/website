'use client';

import { API } from '@/lib/api';
import { selectOrganizations } from '@/lib/redux/slices';
import { Project, handleOrganization, type ProjectDocument } from '@/lib/utils';
import { useSnackbar } from 'notistack';
import { type ReactElement, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
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

  const { enqueueSnackbar } = useSnackbar();

  const organizations = useSelector(selectOrganizations);

  const handleEdit = async (values: Project): Promise<void> => {
    const organizationId = await handleOrganization(
      organizations,
      enqueueSnackbar,
      values.organization,
    );

    API.editProject(projectToEdit._id, {
      ...values,
      organization: organizationId,
      endDate: selectEndDate ? values.endDate : undefined,
    })
      .then(() => {
        enqueueSnackbar('Project edited', { variant: 'success' });
        setShow(false);
      })
      .catch((error) => {
        enqueueSnackbar(error, { variant: 'error' });
        console.error(error);
      });
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit project</Modal.Title>
      </Modal.Header>

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
        }}
        onSubmit={handleEdit}
      />
    </Modal>
  );
}
