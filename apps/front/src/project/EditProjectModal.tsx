import { useSnackbar } from 'notistack';
import { type ReactElement, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import { type AppState } from 'reducers/types';
import { client } from 'utils';
import ProjectForm from './ProjectForm';
import {
  Project,
  handleOrganization,
  type ProjectDocument,
} from './utilsProject';

type EditProjectProps = {
  projectToEdit: ProjectDocument;
  show: boolean;
  setShow: (show: boolean) => void;
};

const stateProps = (
  state: AppState,
): Pick<
  AppState['organizationReducer'] & AppState['adminReducer'],
  'organizations' | 'token'
> => ({
  organizations: state.organizationReducer.organizations,
  token: state.adminReducer.token,
});

const connector = connect(stateProps);

export function EditProjectModal({
  projectToEdit,
  show,
  setShow,
  organizations,
  token,
}: EditProjectProps & ConnectedProps<typeof connector>): ReactElement {
  const [selectEndDate, setSelectEndDate] = useState<boolean>(
    !!projectToEdit.endDate,
  );

  const { enqueueSnackbar } = useSnackbar();

  const handleEdit = async (values: Project): Promise<void> => {
    const organizationId = await handleOrganization(
      organizations,
      enqueueSnackbar,
      values.organization,
      token,
    );

    client
      .put<ProjectDocument>(
        '/project/' + projectToEdit._id,
        {
          ...values,
          organization: organizationId,
          endDate: selectEndDate ? values.endDate : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
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

export default connector(EditProjectModal);
