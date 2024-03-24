import { type ReactElement, useEffect } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import { fetchResume } from 'reducers/actions';
import { type AppState } from 'reducers/types';
import { DOCUMENT_TITLE, socket } from 'utils';

const stateProps = (
  state: AppState,
): Pick<AppState['projectReducer'], 'resume' | 'resumeLoading'> => ({
  resume: state.projectReducer.resume,
  resumeLoading: state.projectReducer.resumeLoading,
});

const dispatchProps = { fetchResume };

const connector = connect(stateProps, dispatchProps);

export function ResumeView({
  resume,
  resumeLoading,
  fetchResume,
}: ConnectedProps<typeof connector>): ReactElement {
  useEffect(() => {
    document.title = `Resume | ${DOCUMENT_TITLE}`;
  }, []);

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  useEffect(() => {
    socket.on('projectAdded', () => {
      fetchResume();
    });
    socket.on('projectEdited', () => {
      fetchResume();
    });
    socket.on('projectDeleted', () => {
      fetchResume();
    });
    socket.on('projectsDeleted', () => {
      fetchResume();
    });
    return () => {
      socket.off('projectAdded');
      socket.off('projectEdited');
      socket.off('projectDeleted');
      socket.off('projectsDeleted');
    };
  }, [fetchResume]);

  if (resumeLoading) return <i>Loading...</i>;

  return (
    <Row>
      <Col xs={3} className="my-3">
        <Card>
          <Card.Header>
            <Card.Title>MULLER Thibault</Card.Title>
          </Card.Header>
          <Card.Body>
            <b className="fs-4">About me</b>
            <br />
            <span>
              Interested in DIY & sciences since young, my passions took me to
              where I am now: in my fourth year of Master of Engineering at
              CentraleSupélec, wanting to become engineer in order to meet the
              needs of tomorrow, with the greatest respect for our environment.
            </span>
            <br />
            <br />
            <b className="fs-4">Skills</b>
            <br />
            <span>
              {resume.competencies.length ? (
                resume.competencies.join(' • ')
              ) : (
                <i>No skills to display</i>
              )}
            </span>
            <br />
            <br />
            <b className="fs-4">Languages</b>
            <br />
            <span>
              French: Native
              <br /> English: C1+
              <br /> German: B1+
            </span>
            <br />
            <br />
            <b className="fs-4">Interests</b>
            <br />
            <span>Photography • Sports • DIY</span>
          </Card.Body>
        </Card>
      </Col>
      <Col className="overflow-auto" style={{ maxHeight: '92vh' }}>
        {resume.projects.length ? (
          resume.projects.map((type) => (
            <Row className="my-3" key={type._id}>
              <Col>
                <Card>
                  <Card.Header>
                    <Card.Title>{type._id}</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    {type.projects.map((project) => (
                      <Row key={project._id.toString()}>
                        <Row>
                          <Col>
                            <b>
                              <span className="fs-4">
                                {project.role}
                                {' | '}
                              </span>
                            </b>
                            <span className="fs-5">
                              <u>{project.organization?.name}</u>
                              {' | '}
                            </span>
                            <span className="fs-7">
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

export default connector(ResumeView);
