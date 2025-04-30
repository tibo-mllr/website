'use client';

import { Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import { useEffect, type ReactElement } from 'react';
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
      <Grid container spacing={2}>
        {resume.projects.length ? (
          resume.projects.map((type) => (
            <Card key={type._id} sx={{ width: '100%' }}>
              <CardHeader title={type._id} />
              <CardContent>
                <Grid container spacing={2}>
                  {type.projects.map((project) => (
                    <Grid
                      container
                      key={project._id.toString()}
                      size={12}
                      spacing={0}
                    >
                      <Grid size={12}>
                        <Typography variant="h5" component="span">
                          <b>
                            {project.role}
                            {' | '}
                          </b>
                        </Typography>
                        {project.organization && (
                          <Typography variant="h6" component="span">
                            <u>{project.organization?.name}</u>
                            {' | '}
                          </Typography>
                        )}
                        <Typography component="span">
                          {new Date(project.startDate).toLocaleDateString()} -{' '}
                          {project.endDate
                            ? new Date(project.endDate).toLocaleDateString()
                            : 'Present'}
                        </Typography>
                      </Grid>
                      <Grid size={12}>
                        <span>
                          <b>{project.title}</b>
                          <br />
                          {project.description}
                          <br />
                          <i>{project.competencies.join(' • ')}</i>
                        </span>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          ))
        ) : (
          <i>No experience to display</i>
        )}
      </Grid>
    </CustomSuspense>
  );
}
