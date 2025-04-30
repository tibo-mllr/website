'use client';

import {
  Autocomplete,
  Card,
  CardContent,
  CardHeader,
  Grid,
} from '@mui/material';
import { useFormikContext } from 'formik';
import { type ReactElement } from 'react';
import { useSelector } from 'react-redux';

import { TextField } from '@/components';
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
    <Grid size={12}>
      <Card>
        <CardHeader title="Organization" />
        <CardContent>
          <Grid container flexDirection="row" spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                freeSolo
                filterSelectedOptions
                options={organizations}
                isOptionEqualToValue={(option, value) =>
                  option.name === value.name
                }
                value={values.organization?.name || ''}
                getOptionLabel={(option) =>
                  typeof option === 'string' ? option : option.name
                }
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
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                name="organization.location"
                label="Location"
                placeholder="Location"
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                name="organization.website"
                label="Website"
                placeholder="Website"
                fullWidth
              />
            </Grid>
            <Grid size={12}>
              <TextField
                multiline
                minRows={4}
                name="organization.description"
                label="Description"
                placeholder="Description"
                fullWidth
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
}
