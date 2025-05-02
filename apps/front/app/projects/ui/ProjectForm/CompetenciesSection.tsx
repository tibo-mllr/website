'use client';

import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import {
  Autocomplete,
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
  Typography,
} from '@mui/material';
import { useFormikContext } from 'formik';
import { useEffect, useState, type ReactElement } from 'react';

import { AddButton, TextField } from '@/components';
import { API } from '@/lib/api';
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

  const [competencies, setCompetencies] = useState<string[]>([]);

  const handleCompetencyChange = (
    index: number,
    newValue: string | null,
  ): void => {
    const newCompetencies = [...values.competencies];
    newCompetencies[index] = newValue ?? '';
    setFieldValue('competencies', newCompetencies);
  };

  useEffect(() => {
    API.getCompetencies().then(setCompetencies);
  }, []);

  return (
    <Grid size={12}>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            {values.competencies.length ? (
              values.competencies.map((competency, index) => (
                <Grid key={index} size={3}>
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
                    onInputChange={(_, newInputValue) => {
                      handleCompetencyChange(index, newInputValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={`Competency ${index + 1}`}
                        name={`competencies[${index}]`}
                        fullWidth
                        slotProps={{
                          input: {
                            ...params.InputProps,
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="Delete"
                                  onClick={() =>
                                    setFieldValue(
                                      'competencies',
                                      values.competencies.filter(
                                        (_, i) => i !== index,
                                      ),
                                    )
                                  }
                                  color="error"
                                  edge="end"
                                >
                                  <DeleteForeverTwoToneIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              ))
            ) : (
              <Grid textAlign="center" size={12}>
                <Typography
                  color={
                    !!touched.competencies && !!errors.competencies
                      ? 'error'
                      : ''
                  }
                >
                  No competencies linked to this project
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center' }}>
          <AddButton
            onClick={() =>
              setFieldValue('competencies', [...values.competencies, ''])
            }
            text="Add competency"
          />
        </CardActions>
      </Card>
    </Grid>
  );
}
