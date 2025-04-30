'use client';

import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import { Grid, IconButton } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { enGB } from 'date-fns/locale';
import { useFormikContext } from 'formik';
import { ReactElement } from 'react';

import { AddButton } from '@/components';
import {
  type OrganizationDocument,
  type Project,
  type ProjectDocument,
} from '@/lib/utils';

type DatesSectionProps = {
  selectEndDate: boolean;
  setSelectEndDate: (selectEndDate: boolean) => void;
};

export default function DatesSection<
  T extends
    | (ProjectDocument & { organization: OrganizationDocument })
    | Project,
>({ selectEndDate, setSelectEndDate }: DatesSectionProps): ReactElement {
  const { setFieldValue } = useFormikContext<T>();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
      <Grid container flexDirection="row" spacing={2} size={12}>
        <Grid size={{ xs: 12, md: 6 }}>
          <DatePicker
            name="startDate"
            label="Start date"
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid container size={{ xs: 12, md: 6 }} alignItems="center">
          {selectEndDate ? (
            <Grid
              container
              flexDirection="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Grid>
                <DatePicker
                  name="endDate"
                  label="End date"
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid marginRight="auto">
                <IconButton
                  aria-label="Delete"
                  onClick={() => {
                    setSelectEndDate(!selectEndDate);
                    setFieldValue('endDate', new Date());
                  }}
                  color="error"
                >
                  <DeleteForeverTwoToneIcon />
                </IconButton>
              </Grid>
            </Grid>
          ) : (
            <AddButton
              onClick={() => {
                setSelectEndDate(!selectEndDate);
                setFieldValue('endDate', new Date());
              }}
              text="Add end date"
            />
          )}
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}
