import { Card, CardContent, CardHeader, Grid } from '@mui/material';
import { type ReactElement } from 'react';

import { CompetenciesSection, ProjectsSection } from './ui';

export default function ResumeView(): ReactElement {
  return (
    <Grid container spacing={2} marginY={2}>
      <Grid size={12}>
        <Card>
          <CardHeader title="MULLER Thibault" />
          <CardContent>
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
            <CompetenciesSection />
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
          </CardContent>
        </Card>
      </Grid>
      <Grid className="overflow-auto" style={{ maxHeight: '92vh' }} size={12}>
        <ProjectsSection />
      </Grid>
    </Grid>
  );
}
