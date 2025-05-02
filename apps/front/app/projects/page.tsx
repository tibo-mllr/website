import { Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import { type ReactElement } from 'react';

import { API } from '@/lib/api';

import {
  CreateProjectModal,
  ProjectActionsWrapper,
  ProjectOrganizationSection,
  ProjectWebSockets,
} from './ui';

export default async function ProjectView(): Promise<ReactElement> {
  const projects = await API.getProjects();

  return (
    <>
      <Grid>
        <Typography textAlign="center" variant="h4" component="h1">
          These are the projects I worked on
        </Typography>
      </Grid>

      {projects.length ? (
        projects.map((project) => (
          <Grid className="my-3" key={project._id}>
            <Grid>
              <Card>
                <CardHeader
                  title={
                    <>
                      <Typography variant="h4" component="span">
                        <b>
                          {project.role}
                          {' | '}
                        </b>
                      </Typography>
                      <ProjectOrganizationSection
                        organization={project.organization}
                      />
                      <Typography variant="h6" component="span">
                        <i>
                          {new Date(project.startDate).toLocaleDateString()} -{' '}
                          {project.endDate
                            ? new Date(project.endDate).toLocaleDateString()
                            : 'Present'}
                        </i>
                      </Typography>
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
                <ProjectActionsWrapper project={project} />
              </Card>
            </Grid>
          </Grid>
        ))
      ) : (
        <i>No project to display</i>
      )}

      <CreateProjectModal />
      <ProjectWebSockets />
    </>
  );
}
