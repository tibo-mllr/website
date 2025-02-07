'use client';

import { useEffect, type ReactElement } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { CustomSuspense, ProjectCardSkeleton } from '@/components';
import { API } from '@/lib/api';
import { fetchResume } from '@/lib/redux/actions';
import { useAppDispatch } from '@/lib/redux/hooks';
import { selectResume, selectResumeLoading } from '@/lib/redux/slices';

export default function ProjectsSestion(): ReactElement {
  const dispatch = useAppDispatch();
  const isLoading = useSelector(selectResumeLoading);
  const resume = useSelector(selectResume);

  useEffect(() => {
    dispatch(fetchResume());
  }, [dispatch]);

  useEffect(() => {
    API.listenTo('projectAdded', () => {
      dispatch(fetchResume());
    });
    API.listenTo('projectEdited', () => {
      dispatch(fetchResume());
    });
    API.listenTo('projectDeleted', () => {
      dispatch(fetchResume());
    });
    API.listenTo('projectsDeleted', () => {
      dispatch(fetchResume());
    });
    return () => {
      API.stopListening('projectAdded');
      API.stopListening('projectEdited');
      API.stopListening('projectDeleted');
      API.stopListening('projectsDeleted');
    };
  }, [dispatch]);

  return (
    <CustomSuspense
      fallback={<ProjectCardSkeleton />}
      count={2}
      isLoading={isLoading}
    >
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
                          {project.organization && (
                            <span className="fs-5">
                              <u>{project.organization?.name}</u>
                              {' | '}
                            </span>
                          )}
                          <span className="fs-7">
                            {new Date(project.startDate).toLocaleDateString()} -{' '}
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
    </CustomSuspense>
  );
}
