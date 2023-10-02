import { ProjectType } from '@website/shared-types';
import { binIcon, editIcon } from 'assets';
import { OrganizationDocument } from 'organization';
import { ReactElement, useEffect, useState } from 'react';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { ConnectedProps, connect } from 'react-redux';
import {
  fetchCompetencies,
  fetchOrganizations,
  fetchProjects,
} from 'redux/actions';
import {
  addCompetencies,
  addOrganization,
  addProject,
  deleteOrganization,
  deleteProject,
  editOrganization,
  editProject,
} from 'redux/slices';
import { AppState } from 'redux/types';
import { client, socket } from 'utils';
import CreateProject from './createProject';
import EditProject from './editProject';
import { ProjectDocument } from './utilsProject';

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
    link: '',
    type: ProjectType.Education,
    organization: {
      _id: '',
      name: '',
      description: '',
      location: '',
      website: '',
    },
    startDate: new Date(),
    endDate: new Date(),
  });
  const [showEdit, setShowEdit] = useState<boolean>(false);

  const handleDelete = (id: string): void => {
    const confirm = window.confirm(
      'Are you sure you want to delete this project ?',
    );
    if (confirm) {
      client
        .delete(`/project/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .catch((error) => console.error(error));
    }
  };

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
      <Row>
        <h1 style={{ textAlign: 'center' }}>
          These are the projects I worked on
        </h1>
      </Row>
      {projects.length ? (
        projects.map((project) => (
          <Row key={project._id} style={{ marginBottom: '8px' }}>
            <Col>
              <Card>
                <Card.Header>
                  <Card.Title>
                    <span style={{ fontSize: '1.5em' }}>
                      {project.role}
                      {' | '}
                    </span>
                    <span
                      style={{ fontSize: '1em' }}
                      onClick={(): void => {
                        setShowOrganization(true);
                        setOrganization(project.organization);
                      }}
                    >
                      <u>{project.organization.name}</u>
                      {' | '}
                    </span>
                    <span style={{ fontSize: '0.75em' }}>
                      {new Date(project.startDate).toLocaleDateString()} -{' '}
                      {project.endDate
                        ? new Date(project.endDate).toLocaleDateString()
                        : 'Present'}
                    </span>
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
                      <a href={project.link}>See more</a>
                    </Col>
                  )}
                  {!!token && userRole === 'superAdmin' && (
                    <Col className="d-flex justify-content-end">
                      <Button
                        onClick={(): void => {
                          setShowEdit(true);
                          setProjectToEdit(project);
                        }}
                        style={{
                          marginRight: '8px',
                        }}
                      >
                        <img
                          alt="Edit"
                          src={editIcon}
                          height="24"
                          className="d-inline-block align-center"
                        />
                      </Button>
                      <Button onClick={(): void => handleDelete(project._id)}>
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
      <Modal
        show={showOrganization}
        onHide={(): void => setShowOrganization(false)}
      >
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
            <a href={organization.website}>{organization.website}</a>
          </p>
        </Modal.Body>
      </Modal>
      {!!token && <CreateProject />}
      {!!token && userRole === 'superAdmin' && (
        <EditProject
          projectToEdit={projectToEdit}
          setProjectToEdit={setProjectToEdit}
          show={showEdit}
          setShow={setShowEdit}
        />
      )}
    </>
  );
}

export default connector(ProjectView);
