import { Button, CardActions, CardContent, Grid } from '@mui/material';
import { Form, Formik, type FormikConfig, type FormikValues } from 'formik';
import { type ReactElement } from 'react';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { Organization, organizationSchema } from '@website/shared-types';

import { TextField } from '@/components';
import { type OrganizationDocument } from '@/lib/utils';

type EditProps = { edit: true; create?: never };
type CreateProps = { create: true; edit?: never };
type OrganizationFormProps<T extends FormikValues> = FormikConfig<T> &
  (EditProps | CreateProps);

export default function OrganizationForm<
  T extends OrganizationDocument | Organization,
>({ edit, create, ...props }: OrganizationFormProps<T>): ReactElement {
  return (
    <Formik
      validationSchema={toFormikValidationSchema(organizationSchema)}
      {...props}
    >
      <Form>
        <CardContent>
          <Grid container spacing={1} width="100%">
            <TextField
              id="name"
              name="name"
              label="Name"
              placeholder="Enter name"
              fullWidth
            />
            <TextField
              multiline
              minRows={4}
              id="description"
              name="description"
              label="Description"
              placeholder="Enter description"
              fullWidth
            />
            <Grid container width="100%" spacing={1}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  id="location"
                  name="location"
                  label="Location"
                  placeholder="Enter location"
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  id="website"
                  name="website"
                  label="Website"
                  placeholder="Enter website"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button type="submit" variant="contained" className="w-full">
            {edit && 'Edit'}
            {create && 'Add'}
          </Button>
        </CardActions>
      </Form>
    </Formik>
  );
}
