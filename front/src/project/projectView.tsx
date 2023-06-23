import { ReactElement, useEffect, useState } from 'react';
import { client } from '../utils';
import { OrganizationDocument, ProjectDocument } from './utilsProject';
import { Card, Col, Modal, Row } from 'react-bootstrap';

export default function ProjectView(): ReactElement {
  const [projects, setProjects] = useState<ProjectDocument[]>([]);
  const [showOrganization, setShowOrganization] = useState(false);
  const [organization, setOrganization] = useState<OrganizationDocument>({
    _id: '',
    name: '',
    location: '',
    website: '',
  });

  useEffect(() => {
    client
      .get('/project')
      .then((response) => {
        setProjects(response.data as ProjectDocument[]);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
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
                {project.link && (
                  <Card.Footer>
                    <a href={project.link}>See more</a>
                  </Card.Footer>
                )}
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
            <b>Location:</b> {organization.location}
          </p>
          <p>
            <b>Website:</b>{' '}
            <a href={organization.website}>{organization.website}</a>
          </p>
        </Modal.Body>
      </Modal>
    </>
  );
}
