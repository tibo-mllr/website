'use client';

import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { CardActions, Grid, IconButton } from '@mui/material';
import Link from 'next/link';
import { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';

import { ProjectType } from '@website/shared-types';

import { ConfirmModal, useNotification } from '@/components';
import { API } from '@/lib/api';
import { selectToken, selectUserRole } from '@/lib/redux/slices';
import { ProjectDocument } from '@/lib/utils';

import EditProjectModal from './EditProjectModal';

type ProjectActionsProps = {
  project: ProjectDocument;
};

export function ProjectActions({ project }: ProjectActionsProps): ReactElement {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
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

  const token = useSelector(selectToken);
  const userRole = useSelector(selectUserRole);

  const { notify } = useNotification();

  const handleDelete = (id: string): void => {
    API.deleteProject(id)
      .then(() => notify('Project deleted', { severity: 'success' }))
      .catch((error) => {
        notify('Error deleting project', { severity: 'error' });
        console.error(error);
      });
  };

  return (
    <>
      <ConfirmModal
        title="Delete project"
        message="Are you sure you want to delete this project?"
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => handleDelete(projectToEdit._id)}
      />
      {userRole === 'superAdmin' && (
        <EditProjectModal
          projectToEdit={projectToEdit}
          show={showEdit}
          setShow={setShowEdit}
        />
      )}
      {(!!project.link || (!!token && userRole === 'superAdmin')) && (
        <CardActions>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            {project.link && (
              <Link href={project.link} target="_blank" rel="noreferrer">
                See more
              </Link>
            )}
            {!!token && userRole === 'superAdmin' && (
              <Grid className="ms-auto justify-content-end" display="flex">
                <IconButton
                  aria-label="Edit"
                  onClick={() => {
                    setShowEdit(true);
                    setProjectToEdit(project);
                  }}
                  color="warning"
                >
                  <EditTwoToneIcon />
                </IconButton>
                <IconButton
                  aria-label="Delete"
                  onClick={() => {
                    setShowConfirm(true);
                    setProjectToEdit(project);
                  }}
                  color="error"
                >
                  <DeleteForeverTwoToneIcon />
                </IconButton>
              </Grid>
            )}
          </Grid>
        </CardActions>
      )}
    </>
  );
}
