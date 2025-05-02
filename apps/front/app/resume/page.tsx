import { Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import { type ReactElement } from 'react';

import { API } from '@/lib/api';

import { CompetenciesSection, ProjectsSection } from './ui';

export default async function ResumeView(): Promise<ReactElement> {
  const resume = await API.getResume();

  return (
    <Grid container spacing={2} marginY={2}>
      <Grid size={3}>
        <Card>
          <CardHeader title="MULLER Thibault" />
          <CardContent>
            <Typography variant="h5" component="span">
              <b>About me</b>
            </Typography>
            <br />
            <span>
              Interested in DIY & sciences since young, my passions took me to
              where I am now: in my fourth year of Master of Engineering at
              CentraleSupélec, wanting to become engineer in order to meet the
              needs of tomorrow, with the greatest respect for our environment.
            </span>
            <br />
            <br />
            <Typography variant="h5" component="span">
              <b>Skills</b>
            </Typography>
            <br />
            <CompetenciesSection competencies={resume.competencies} />
            <br />
            <br />
            <Typography variant="h5" component="span">
              <b>Languages</b>
            </Typography>
            <br />
            <span>
              French: Native
              <br /> English: C1+
              <br /> German: B1+
            </span>
            <br />
            <br />
            <Typography variant="h5" component="span">
              <b>Interests</b>
            </Typography>
            <br />
            <span>Photography • Sports • DIY</span>
          </CardContent>
        </Card>
      </Grid>
      <Grid className="overflow-auto" style={{ maxHeight: '92vh' }} size={9}>
        <ProjectsSection projects={resume.projects} />
      </Grid>
    </Grid>
  );
}
