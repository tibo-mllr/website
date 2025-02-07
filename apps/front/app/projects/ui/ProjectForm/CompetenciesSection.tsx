'use client';

import { useFormikContext } from 'formik';
import Image from 'next/image';
import { type ReactElement } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { plusIcon } from '@/app/ui/assets';
import { DataList } from '@/components';
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

  return (
    <Card>
      <datalist id="competenciesList">
        {competencies.map((competency) => (
          <option key={competency} value={competency} />
        ))}
      </datalist>
      <Card.Body>
        <Row>
          {values.competencies.length ? (
            values.competencies.map((_, index) => (
              <Col key={index} md={4}>
                <DataList
                  name={`competencies[${index}]`}
                  label={`Competency ${index + 1}`}
                  groupClassName="mb-3"
                  placeholder="Competency"
                  listId="competenciesList"
                  autoComplete="off"
                  onDeleteOption={() =>
                    setFieldValue(
                      'competencies',
                      values.competencies.filter((_, i) => i !== index),
                    )
                  }
                />
              </Col>
            ))
          ) : (
            <Row>
              <Col
                className={`text-center ${touched.competencies && !!errors.competencies ? 'text-invalid' : ''}`}
              >
                No competencies linked to this project
              </Col>
            </Row>
          )}
        </Row>
      </Card.Body>
      <Card.Footer>
        <Button
          onClick={() =>
            setFieldValue('competencies', [...values.competencies, ''])
          }
          className="btn-add"
        >
          <Image alt="Plus icon" src={plusIcon} height="16" />
          Add competency
        </Button>
      </Card.Footer>
    </Card>
  );
}
