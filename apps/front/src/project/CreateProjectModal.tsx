import { PartialBy, ProjectType } from '@website/shared-types';
import { useSnackbar } from 'notistack';
import { type ReactElement, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import { switchShowNewProject } from 'reducers/slices';
import { type AppState } from 'reducers/types';
import { client } from 'utils';
import ProjectForm from './ProjectForm';
import {
  handleOrganization,
  type Project,
  type ProjectDocument,
} from './utilsProject';

const stateProps = (
  state: AppState,
): Pick<
  AppState['projectReducer'] & AppState['organizationReducer'],
  'showNew' | 'organizations'
> => ({
  showNew: state.projectReducer.showNew,
  organizations: state.organizationReducer.organizations,
});

const dispatchProps = { setShow: switchShowNewProject };

const connector = connect(stateProps, dispatchProps);

export function CreateProjectModal({
  showNew,
  organizations,
  setShow,
}: ConnectedProps<typeof connector>): ReactElement {
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

  const { enqueueSnackbar } = useSnackbar();

  const handleCreate = async (
    newProject: PartialBy<Project, 'organization'>,
  ): Promise<void> => {
    const organizationId = await handleOrganization(
      organizations,
      enqueueSnackbar,
      newProject.organization,
    );

    client
      .post<ProjectDocument>('/project', {
        ...newProject,
        organization: organizationId,
        endDate: selectEndDate ? newProject.endDate : undefined,
      })
      .then(() => {
        enqueueSnackbar('Project added', { variant: 'success' });
        setShow(false);
      })
      .catch((error) => {
        enqueueSnackbar(error, { variant: 'error' });
        console.error(error);
      });
  };

  return (
    <Modal show={showNew} onHide={() => setShow(false)} size="lg">
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

export default connector(CreateProjectModal);
