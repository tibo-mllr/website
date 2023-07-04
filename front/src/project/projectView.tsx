import { ReactElement, useEffect, useState } from 'react';
import { client } from '../utils';
import { ProjectDocument, ProjectType } from './utilsProject';
import { OrganizationDocument } from '../organization/utilsOrganization';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import editIcon from '../assets/editIcon.png';
import binIcon from '../assets/binIcon.png';
import CreateProject from './createProject';
import EditProject from './editProject';

type ProjectViewProps = {
  showNew: boolean;
  setShowNew: (show: boolean) => void;
};
export default function ProjectView({
  showNew,
  setShowNew,
}: ProjectViewProps): ReactElement {
  const [projects, setProjects] = useState<ProjectDocument[]>([]);
  const [organizations, setOrganizations] = useState<OrganizationDocument[]>(
    [],
  );
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
    client
      .delete('/project/' + id, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('loginToken')}`,
        },
      })
      .then(() => setProjects(projects.filter((project) => project._id !== id)))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    client
      .get('/project')
      .then((response) => setProjects(response.data as ProjectDocument[]))
      .catch((error) => console.log(error));
    client
      .get('/organization')
      .then((response) =>
        setOrganizations(response.data as OrganizationDocument[]),
      )
      .catch((error) => console.log(error));
  }, []);

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
                  {!!sessionStorage.getItem('loginToken') &&
                    sessionStorage.getItem('role') === 'superAdmin' && (
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
      {!!sessionStorage.getItem('loginToken') && (
        <CreateProject
          show={showNew}
          setShow={setShowNew}
          organizations={organizations}
          setOrganizations={setOrganizations}
          projects={projects}
          setProjects={setProjects}
        />
      )}
      {!!sessionStorage.getItem('loginToken') &&
        sessionStorage.getItem('role') === 'superAdmin' && (
          <EditProject
            projectToEdit={projectToEdit}
            setProjectToEdit={setProjectToEdit}
            show={showEdit}
            setShow={setShowEdit}
            projects={projects}
            setProjects={setProjects}
            organizations={organizations}
            setOrganizations={setOrganizations}
          />
        )}
    </>
  );
}
