import { Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import { type ReactElement } from 'react';

import { API } from '@/lib/api';

import {
  CreateOrganizationModal,
  OrganizationActions,
  OrganizationWebSockets,
} from './ui';

export default async function OrganizationView(): Promise<ReactElement> {
  const organizations = await API.getOrganizations();

  return (
    <>
      <Grid>
        <Typography textAlign="center" variant="h4" component="h1">
          These are the organizations I worked for
        </Typography>
      </Grid>
      {organizations.length ? (
        organizations.map((organization) => (
          <Card className="my-3" key={organization._id}>
            <CardHeader
              title={
                <>
                  <b>{organization.name}</b>, {organization.location}
                </>
              }
            />
            <CardContent>
              {organization.description ?? <i>No description provided</i>}
              <br />
              <br />
              <b>Website: </b>
              <a href={organization.website} target="_blank" rel="noreferrer">
                {organization.website}
              </a>
            </CardContent>
            <OrganizationActions organization={organization} />
          </Card>
        ))
      ) : (
        <i>No organization to display</i>
      )}

      <CreateOrganizationModal />
      <OrganizationWebSockets />
    </>
  );
}
