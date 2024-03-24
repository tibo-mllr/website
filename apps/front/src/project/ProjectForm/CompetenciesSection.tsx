import { plusIcon } from 'assets';
import { DataList } from 'components';
import { useFormikContext } from 'formik';
import { type OrganizationDocument } from 'organization';
import { type ReactElement } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { connect, ConnectedProps } from 'react-redux';
import { AppState } from 'reducers/types';
import { Project, type ProjectDocument } from '../utilsProject';

const stateProps = (
  state: AppState,
): Pick<AppState['projectReducer'], 'competencies'> => ({
  competencies: state.projectReducer.competencies,
});

const connector = connect(stateProps);

function CompetenciesSection<
  T extends
    | (ProjectDocument & { organization: OrganizationDocument })
    | Project,
>({ competencies }: ConnectedProps<typeof connector>): ReactElement {
  const { values, touched, errors, setFieldValue } = useFormikContext<T>();

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
          <img alt="Plus icon" src={plusIcon} height="16" />
          Add competency
        </Button>
      </Card.Footer>
    </Card>
  );
}

export default connector(CompetenciesSection);
