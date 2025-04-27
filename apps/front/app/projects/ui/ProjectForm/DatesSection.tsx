'use client';

import { Button, FormGroup, FormLabel, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useFormikContext } from 'formik';
import Image from 'next/image';
import { ReactElement } from 'react';

import { binIcon, plusIcon } from '@/app/ui/assets';
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
    <FormGroup className="mb-3">
      <Grid>
        <Grid>
          <DatePicker name="startDate" label="Start date" />
        </Grid>
        <Grid>
          <Grid>
            <FormGroup className="mb-3">
              <FormLabel>End date</FormLabel>
              {selectEndDate ? (
                <FormGroup>
                  <DatePicker name="endDate" />
                  <Button
                    onClick={() => {
                      setSelectEndDate(!selectEndDate);
                      setFieldValue('endDate', new Date());
                    }}
                  >
                    <Image alt="Bin icon" src={binIcon} height="16" />
                  </Button>
                </FormGroup>
              ) : (
                <Grid>
                  <Button
                    onClick={() => {
                      setSelectEndDate(!selectEndDate);
                      setFieldValue('endDate', new Date());
                    }}
                    className="btn-add"
                  >
                    <Image alt="Plus icon" src={plusIcon} height="16" />
                    Add end date
                  </Button>
                </Grid>
              )}
            </FormGroup>
          </Grid>
        </Grid>
      </Grid>
    </FormGroup>
  );
}
