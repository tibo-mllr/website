import { Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import { type ReactElement } from 'react';

import { Resume } from '@/lib/utils';

import { ResumeWebSockets } from './ResumeWebSockets';

type ProjectsSectionProps = {
  projects: Resume['projects'];
};

export default function ProjectsSection({
  projects,
}: ProjectsSectionProps): ReactElement {
  return (
    <Grid container spacing={2}>
      {projects.length ? (
        projects.map((type) => (
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
      <ResumeWebSockets />
    </Grid>
  );
}
