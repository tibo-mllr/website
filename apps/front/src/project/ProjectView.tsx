import { ProjectType } from '@website/shared-types';
import { binIcon, editIcon } from 'assets';
import { ConfirmModal } from 'components';
import { useSnackbar } from 'notistack';
import { type OrganizationDocument } from 'organization';
import { type ReactElement, useEffect, useState } from 'react';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import {
  fetchCompetencies,
  fetchOrganizations,
  fetchProjects,
} from 'reducers/actions';
import {
  addCompetencies,
  addOrganization,
  addProject,
  deleteOrganization,
  deleteProject,
  editOrganization,
  editProject,
} from 'reducers/slices';
import { type AppState } from 'reducers/types';
import { DOCUMENT_TITLE, client, socket } from 'utils';
import CreateProjectModal from './CreateProjectModal';
import EditProjectModal from './EditProjectModal';
import { type ProjectDocument } from './utilsProject';

const stateProps = (
  state: AppState,
): Pick<
  AppState['projectReducer'] & AppState['adminReducer'],
  'projects' | 'isLoading' | 'token' | 'userRole'
> => ({
  projects: state.projectReducer.projects,
  isLoading: state.projectReducer.isLoading,
  token: state.adminReducer.token,
  userRole: state.adminReducer.userRole,
});

const dispatchProps = {
  addProject,
  deleteProject,
  editProject,
  addCompetencies,
  addOrganization,
  deleteOrganization,
  editOrganization,
  fetchProjects,
  fetchCompetencies,
  fetchOrganizations,
};

const connector = connect(stateProps, dispatchProps);

export function ProjectView({
  projects,
  isLoading,
  token,
  userRole,
  addProject,
  addCompetencies,
  deleteProject,
  editProject,
  fetchProjects,
  fetchCompetencies,
  fetchOrganizations,
}: ConnectedProps<typeof connector>): ReactElement {
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showOrganization, setShowOrganization] = useState<boolean>(false);
  const [organization, setOrganization] = useState<OrganizationDocument>({
    _id: '',
    name: '',
    description: '',
    location: '',
    website: '',
  });
  const [projectToEdit, setProjectToEdit] = useState<ProjectDocument>({
    _id: '',
    role: '',
    title: '',
    description: '',
    competencies: [],
    type: ProjectType.Education,
    organization: {
      _id: '',
      name: '',
      description: '',
      location: '',
      website: '',
    },
    startDate: new Date(),
  });
  const [showEdit, setShowEdit] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = (id: string): void => {
    client
      .delete(`/project/${id}`)
      .then(() => enqueueSnackbar('Project deleted', { variant: 'success' }))
      .catch((error) => {
        enqueueSnackbar('Error deleting project', { variant: 'error' });
        console.error(error);
      });
  };

  useEffect(() => {
    document.title = `Projects | ${DOCUMENT_TITLE}`;
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchCompetencies();
    fetchOrganizations();
  }, [fetchProjects, fetchCompetencies, fetchOrganizations]);

  useEffect(() => {
    socket.on('projectAdded', (newProject: ProjectDocument) => {
      addProject(newProject);
      addCompetencies(newProject.competencies);
    });
    socket.on('projectEdited', (editedProject: ProjectDocument) => {
      editProject(editedProject);
      fetchCompetencies();
    });
    socket.on('projectDeleted', (id: string) => {
      deleteProject(id);
      fetchCompetencies();
    });
    // Several projects deleted by cascade with an organization
    socket.on('projectsDeleted', () => {
      fetchProjects();
      fetchCompetencies();
    });
    // Calls that can be made for the creation/edition of a project
    socket.on('organizationAdded', (newOrganization: OrganizationDocument) =>
      addOrganization(newOrganization),
    );
    socket.on(
      'organizationEdited',
      (editedOrganization: OrganizationDocument) =>
        editOrganization(editedOrganization),
    );
    socket.on('organizationDeleted', (id: string) => deleteOrganization(id));
    return () => {
      socket.off('projectAdded');
      socket.off('projectEdited');
      socket.off('projectDeleted');
      socket.off('projectsDeleted');
      socket.off('organizationAdded');
      socket.off('organizationEdited');
      socket.off('organizationDeleted');
    };
  }, [
    addCompetencies,
    addProject,
    deleteProject,
    editProject,
    fetchCompetencies,
    fetchProjects,
  ]);

  if (isLoading) return <i>Loading...</i>;

  return (
    <>
      <ConfirmModal
        title="Delete project"
        message="Are you sure you want to delete this project?"
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => handleDelete(projectToEdit._id)}
      />
      <Row>
        <h1 className="text-center">These are the projects I worked on</h1>
      </Row>
      {projects.length ? (
        projects.map((project) => (
          <Row className="my-3" key={project._id}>
            <Col>
              <Card>
                <Card.Header>
                  <Card.Title>
                    <span className="fs-2">
                      {project.role}
                      {' | '}
                    </span>
                    {project.organization && (
                      <span
                        className="fs-4 "
                        role="button"
                        onClick={() => {
                          setShowOrganization(true);
                          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                          setOrganization(project.organization!);
                        }}
                      >
                        <u>{project.organization.name}</u>
                        {' | '}
                      </span>
                    )}
                    <i className="fs-6">
                      {new Date(project.startDate).toLocaleDateString()} -{' '}
                      {project.endDate
                        ? new Date(project.endDate).toLocaleDateString()
                        : 'Present'}
                    </i>
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  <Card.Text>
                    <b>{project.title}</b>
                    <br />
                    {project.description}
                    <br />
                    <i>{project.competencies.join(' • ')}</i>
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  {project.link && (
                    <Col>
                      <a href={project.link} target="_blank">
                        See more
                      </a>
                    </Col>
                  )}
                  {!!token && userRole === 'superAdmin' && (
                    <Col className="d-flex justify-content-end gap-2">
                      <Button
                        onClick={() => {
                          setShowEdit(true);
                          setProjectToEdit(project);
                        }}
                      >
                        <img
                          alt="Edit"
                          src={editIcon}
                          height="24"
                          className="d-inline-block align-center"
                        />
                      </Button>
                      <Button
                        onClick={() => {
                          setShowConfirm(true);
                          setProjectToEdit(project);
                        }}
                      >
                        <img
                          alt="Delete"
                          src={binIcon}
                          height="24"
                          className="d-inline-block align-center"
                        />
                      </Button>
                    </Col>
                  )}
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        ))
      ) : (
        <i>No project to display</i>
      )}
      <Modal show={showOrganization} onHide={() => setShowOrganization(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{organization.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <b>Location: </b>
            {organization.location}
          </p>
          <p>
            <b>Website: </b>
            <a href={organization.website} target="_blank">
              {organization.website}
            </a>
          </p>
        </Modal.Body>
      </Modal>
      {!!token && <CreateProjectModal />}
      {!!token && userRole === 'superAdmin' && (
        <EditProjectModal
          projectToEdit={projectToEdit}
          show={showEdit}
          setShow={setShowEdit}
        />
      )}
    </>
  );
}

export default connector(ProjectView);
