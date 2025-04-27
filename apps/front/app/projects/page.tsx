'use client';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Modal,
} from '@mui/material';
import Image from 'next/image';
import { useEffect, useState, type ReactElement } from 'react';
import { useSelector } from 'react-redux';

import { ProjectType } from '@website/shared-types';

import { binIcon, editIcon } from '@/app/ui/assets';
import {
  ConfirmModal,
  CustomSuspense,
  ProjectCardSkeleton,
} from '@/components';
import { useNotification } from '@/components/NotificationProvider';
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

  const { notify } = useNotification();

  const handleDelete = (id: string): void => {
    API.deleteProject(id)
      .then(() => notify('Project deleted', { severity: 'success' }))
      .catch((error) => {
        notify('Error deleting project', { severity: 'error' });
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
      <Grid>
        <h1 className="text-center">These are the projects I worked on</h1>
      </Grid>
      <CustomSuspense
        fallback={<ProjectCardSkeleton />}
        count={2}
        isLoading={isLoading}
      >
        {projects.length ? (
          projects.map((project) => (
            <Grid className="my-3" key={project._id}>
              <Grid>
                <Card>
                  <CardHeader
                    title={
                      <>
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
                      </>
                    }
                  />
                  <CardContent>
                    <b>{project.title}</b>
                    <br />
                    {project.description}
                    <br />
                    <i>{project.competencies.join(' • ')}</i>
                  </CardContent>
                  {!!project.link ||
                    (!!token && userRole === 'superAdmin' && (
                      <CardActions>
                        <Grid>
                          {project.link && (
                            <Grid>
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noreferrer"
                              >
                                See more
                              </a>
                            </Grid>
                          )}
                          {!!token && userRole === 'superAdmin' && (
                            <Grid className="d-flex justify-content-end gap-2">
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
                            </Grid>
                          )}
                        </Grid>
                      </CardActions>
                    ))}
                </Card>
              </Grid>
            </Grid>
          ))
        ) : (
          <i>No project to display</i>
        )}
      </CustomSuspense>
      <Modal open={showOrganization} onClose={() => setShowOrganization(false)}>
        <Card>
          <CardHeader title={organization.name} closeButton />
          <CardContent>
            <p>
              <b>Location: </b>
              {organization.location}
            </p>
            <p>
              <b>Website: </b>
              <a href={organization.website} target="_blank" rel="noreferrer">
                {organization.website}
              </a>
            </p>
          </CardContent>
        </Card>
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
