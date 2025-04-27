'use client';

import { Autocomplete, Card, CardHeader, Grid, TextField } from '@mui/material';
import { useFormikContext } from 'formik';
import { type ReactElement } from 'react';
import { useSelector } from 'react-redux';

import { selectOrganizations } from '@/lib/redux/slices';
import {
  type OrganizationDocument,
  type Project,
  type ProjectDocument,
} from '@/lib/utils';

export default function OrganizationSection<
  T extends
    | (ProjectDocument & { organization: OrganizationDocument })
    | Project,
>(): ReactElement {
  const { values, setFieldValue } = useFormikContext<T>();

  const organizations = useSelector(selectOrganizations);

  return (
    <Card className="mb-3 p-2">
      <CardHeader title="Organization" />
      <Grid>
        <Grid>
          <Autocomplete
            freeSolo
            options={organizations}
            getOptionLabel={(option) =>
              typeof option === 'string' ? option : option.name
            }
            value={values.organization?.name || ''}
            onChange={(event, newValue) => {
              if (typeof newValue === 'string') {
                // User typed a new name
                setFieldValue('organization', {
                  name: newValue,
                  description: '',
                  location: '',
                  website: '',
                });
              } else if (newValue) {
                // User picked an existing org
                setFieldValue('organization', newValue);
              }
            }}
            onInputChange={(event, newInputValue) => {
              setFieldValue('organization.name', newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Name"
                name="organization.name"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid>
          <TextField
            name="organization.location"
            label="Location"
            placeholder="Location"
          />
        </Grid>
        <Grid>
          <TextField
            name="organization.website"
            label="Website"
            placeholder="Website"
          />
        </Grid>
        <Grid>
          <TextField
            type="text"
            multiline
            name="organization.description"
            label="Description"
            placeholder="Description"
            style={{ height: '10vh' }}
          />
        </Grid>
      </Grid>
    </Card>
  );
}
