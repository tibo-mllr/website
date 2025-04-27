import { Button, CardActions, CardContent, TextField } from '@mui/material';
import { Formik, type FormikConfig, type FormikValues } from 'formik';
import { type ReactElement } from 'react';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { Organization, organizationSchema } from '@website/shared-types';

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
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <CardContent>
            <TextField name="name" label="Name" placeholder="Enter name" />
            <TextField
              type="text"
              multiline
              name="description"
              label="Description"
              placeholder="Enter description"
              style={{ height: '20vh' }}
            />
            <TextField
              name="location"
              label="Location"
              placeholder="Enter location"
            />
            <TextField
              name="website"
              label="Website"
              placeholder="Enter website"
            />
          </CardContent>
          <CardActions>
            <Button type="submit">
              {edit && 'Edit'}
              {create && 'Add'}
            </Button>
          </CardActions>
        </form>
      )}
    </Formik>
  );
}
