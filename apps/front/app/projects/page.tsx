'use client';

import { binIcon, editIcon } from '@/app/ui/assets';
import { ConfirmModal, ProjectCardSkeleton } from '@/components';
import { API } from '@/lib/api';
import {
  fetchCompetencies,
  fetchOrganizations,
  fetchProjects,
} from '@/lib/redux/actions';
import { useAppDispatch } from '@/lib/redux/hooks';
import {
  addCompetencies,
  addOrganization,
  addProject,
  deleteOrganization,
  deleteProject,
  editOrganization,
  editProject,
  selectProjects,
  selectProjectsLoading,
  selectToken,
  selectUserRole,
} from '@/lib/redux/slices';
import { type OrganizationDocument, type ProjectDocument } from '@/lib/utils';
import { ProjectType } from '@website/shared-types';
import Image from 'next/image';
import { useSnackbar } from 'notistack';
import { type ReactElement, useEffect, useState } from 'react';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { CreateProjectModal, EditProjectModal } from './ui';

export default function ProjectView(): ReactElement {
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

  const dispatch = useAppDispatch();
  const token = useSelector(selectToken);
  const userRole = useSelector(selectUserRole);
  const projects = useSelector(selectProjects);
  const isLoading = useSelector(selectProjectsLoading);

  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = (id: string): void => {
    API.deleteProject(id)
      .then(() => enqueueSnackbar('Project deleted', { variant: 'success' }))
      .catch((error) => {
        enqueueSnackbar('Error deleting project', { variant: 'error' });
        console.error(error);
      });
  };

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchCompetencies());
    dispatch(fetchOrganizations());
  }, [dispatch]);

  useEffect(() => {
    API.listenTo('projectAdded', (newProject: ProjectDocument) => {
      dispatch(addProject(newProject));
      dispatch(addCompetencies(newProject.competencies));
    });
    API.listenTo('projectEdited', (editedProject: ProjectDocument) => {
      dispatch(editProject(editedProject));
      dispatch(fetchCompetencies());
    });
    API.listenTo('projectDeleted', (id: string) => {
      dispatch(deleteProject(id));
      dispatch(fetchCompetencies());
    });
    // Several projects deleted by cascade with an organization
    API.listenTo('projectsDeleted', () => {
      dispatch(fetchProjects());
      dispatch(fetchCompetencies());
    });
    // Calls that can be made for the creation/edition of a project
    API.listenTo('organizationAdded', (newOrganization: OrganizationDocument) =>
      dispatch(addOrganization(newOrganization)),
    );
    API.listenTo(
      'organizationEdited',
      (editedOrganization: OrganizationDocument) =>
        dispatch(editOrganization(editedOrganization)),
    );
    API.listenTo('organizationDeleted', (id: string) =>
      dispatch(deleteOrganization(id)),
    );
    return () => {
      API.stopListening('projectAdded');
      API.stopListening('projectEdited');
      API.stopListening('projectDeleted');
      API.stopListening('projectsDeleted');
      API.stopListening('organizationAdded');
      API.stopListening('organizationEdited');
      API.stopListening('organizationDeleted');
    };
  }, [dispatch]);

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
      {isLoading ? (
        <>
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </>
      ) : projects.length ? (
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
                {!!project.link ||
                  (!!token && userRole === 'superAdmin' && (
                    <Card.Footer>
                      <Row>
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
                              <Image
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
                              <Image
                                alt="Delete"
                                src={binIcon}
                                height="24"
                                className="d-inline-block align-center"
                              />
                            </Button>
                          </Col>
                        )}
                      </Row>
                    </Card.Footer>
                  ))}
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
