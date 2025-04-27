'use client';

import {
  Autocomplete,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
} from '@mui/material';
import { useFormikContext } from 'formik';
import Image from 'next/image';
import { type ReactElement } from 'react';
import { useSelector } from 'react-redux';

import { plusIcon } from '@/app/ui/assets';
import { selectCompetencies } from '@/lib/redux/slices';
import {
  Project,
  type OrganizationDocument,
  type ProjectDocument,
} from '@/lib/utils';

export default function CompetenciesSection<
  T extends
    | (ProjectDocument & { organization: OrganizationDocument })
    | Project,
>(): ReactElement {
  const { values, touched, errors, setFieldValue } = useFormikContext<T>();

  const competencies = useSelector(selectCompetencies);

  const handleCompetencyChange = (
    index: number,
    newValue: string | null,
  ): void => {
    const newCompetencies = [...values.competencies];
    newCompetencies[index] = newValue ?? '';
    setFieldValue('competencies', newCompetencies);
  };

  return (
    <Card>
      <datalist id="competenciesList">
        {competencies.map((competency) => (
          <option key={competency} value={competency} />
        ))}
      </datalist>
      <CardContent>
        <Grid>
          {values.competencies.length ? (
            values.competencies.map((competency, index) => (
              <Grid key={index}>
                <Autocomplete
                  freeSolo
                  options={competencies}
                  value={competency}
                  onChange={(_, newValue) =>
                    handleCompetencyChange(
                      index,
                      typeof newValue === 'string' ? newValue : '',
                    )
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={`Competency ${index + 1}`}
                      name={`competencies[${index}]`}
                      error={Boolean(
                        touched.competencies && errors.competencies,
                      )}
                      helperText={
                        touched.competencies && errors.competencies
                          ? 'Invalid competency'
                          : ''
                      }
                    />
                  )}
                  onInputChange={(_, newInputValue) => {
                    // Handle typing directly if needed
                    handleCompetencyChange(index, newInputValue);
                  }}
                />
                <Button
                  color="error"
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    setFieldValue(
                      'competencies',
                      values.competencies.filter((_, i) => i !== index),
                    )
                  }
                  style={{ marginTop: '8px' }}
                >
                  Delete
                </Button>
              </Grid>
            ))
          ) : (
            <Grid>
              <Grid
                className={`text-center ${touched.competencies && !!errors.competencies ? 'text-invalid' : ''}`}
              >
                No competencies linked to this project
              </Grid>
            </Grid>
          )}
        </Grid>
      </CardContent>
      <CardActions>
        <Button
          onClick={() =>
            setFieldValue('competencies', [...values.competencies, ''])
          }
          className="btn-add"
        >
          <Image alt="Plus icon" src={plusIcon} height="16" />
          Add competency
        </Button>
      </CardActions>
    </Card>
  );
}
