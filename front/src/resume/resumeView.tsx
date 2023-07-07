import { ReactElement, useEffect, useState } from 'react';
import { client, socket } from '../utils';
import { Card, Col, Row } from 'react-bootstrap';
import { Resume } from './utilsResume';

export default function ResumeView(): ReactElement {
  const [resume, setResume] = useState<Resume>({
    projects: [],
    competencies: [],
  });

  useEffect(() => {
    client
      .get('/resume')
      .then((response) => setResume(response.data as Resume))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    socket.on('projectAdded', () => {
      client
        .get('/resume')
        .then((response) => setResume(response.data as Resume))
        .catch((error) => console.log(error));
    });
    socket.on('projectEdited', () => {
      client
        .get('/resume')
        .then((response) => setResume(response.data as Resume))
        .catch((error) => console.log(error));
    });
    socket.on('projectDeleted', () => {
      client
        .get('/resume')
        .then((response) => setResume(response.data as Resume))
        .catch((error) => console.log(error));
    });
    socket.on('projectsDeleted', () => {
      client
        .get('/resume')
        .then((response) => setResume(response.data as Resume))
        .catch((error) => console.log(error));
    });
    return () => {
      socket.off('projectAdded');
      socket.off('projectEdited');
      socket.off('projectDeleted');
      socket.off('projectsDeleted');
    };
  }, []);

  return (
    <Row>
      <Col xs={3}>
        <Card>
          <Card.Header>
            <Card.Title>MULLER Thibault</Card.Title>
          </Card.Header>
          <Card.Body>
            <b style={{ fontSize: '1.2em' }}>About me</b>
            <br />
            <span>
              Interested in DIY & sciences since young, my passions took me to
              where I am now: in my fourth year of Master of Engineering at
              CentraleSupélec, wanting to become engineer in order to meet the
              needs of tomorrow, with the greatest respect for our environment.
            </span>
            <br />
            <br />
            <b style={{ fontSize: '1.2em' }}>Skills</b>
            <br />
            <span>
              {resume.competencies.length ? (
                resume.competencies.map((competency, index) => (
                  <span key={index}>
                    {competency.competencies.join(' • ')}
                    {index !== resume.competencies.length - 1 ? ' • ' : ''}
                  </span>
                ))
              ) : (
                <i>No skills to display</i>
              )}
            </span>
            <br />
            <br />
            <b style={{ fontSize: '1.2em' }}>Languages</b>
            <br />
            <span>
              French: Native
              <br /> English: C1+
              <br /> German: B1+
            </span>
            <br />
            <br />
            <b style={{ fontSize: '1.2em' }}>Interests</b>
            <br />
            <span>Photography • Sports • DIY</span>
          </Card.Body>
        </Card>
      </Col>
      <Col>
        {resume.projects.length ? (
          resume.projects.map((type) => (
            <Row style={{ marginBottom: '8px' }} key={type._id}>
              <Col>
                <Card>
                  <Card.Header>
                    <Card.Title>{type._id}</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    {type.projects.map((project) => (
                      <Row key={project._id}>
                        <Row>
                          <Col>
                            <b>
                              <span style={{ fontSize: '1.3em' }}>
                                {project.role}
                                {' | '}
                              </span>
                            </b>
                            <span style={{ fontSize: '1em' }}>
                              <u>{project.organization.name}</u>
                              {' | '}
                            </span>
                            <span style={{ fontSize: '0.75em' }}>
                              {new Date(project.startDate).toLocaleDateString()}{' '}
                              -{' '}
                              {project.endDate
                                ? new Date(project.endDate).toLocaleDateString()
                                : 'Present'}
                            </span>
                          </Col>
                        </Row>
                        <Row>
                          <span>
                            <b>{project.title}</b>
                            <br />
                            {project.description}
                            <br />
                            <i>{project.competencies.join(' • ')}</i>
                          </span>
                        </Row>
                      </Row>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ))
        ) : (
          <i>No experience to display</i>
        )}
      </Col>
    </Row>
  );
}
