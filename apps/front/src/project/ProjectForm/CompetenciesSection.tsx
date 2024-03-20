import { plusIcon } from 'assets';
import { ErrorMessage, useFormikContext } from 'formik';
import { type OrganizationDocument } from 'organization';
import { type ReactElement } from 'react';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
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
  const { values, touched, errors, handleChange, setFieldValue } =
    useFormikContext<T>();

  return (
    <Card>
      <Card.Body>
        {values.competencies.length ? (
          values.competencies.map((_, index) => (
            <Row key={index}>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Competency</Form.Label>
                  <Form.Control
                    type="text"
                    name={`competencies[${index}]`}
                    list="competenciesList"
                    value={values.competencies[index]}
                    onChange={handleChange}
                    placeholder="Competency"
                    isInvalid={
                      touched.competencies && !!errors.competencies?.[index]
                    }
                  />
                  <datalist id="competenciesList">
                    {competencies.map((competency) => (
                      <option key={competency} value={competency} />
                    ))}
                  </datalist>
                  <ErrorMessage name={`competencies.${index}`}>
                    {(errorMessage) => (
                      <Form.Control.Feedback type="invalid">
                        {errorMessage}
                      </Form.Control.Feedback>
                    )}
                  </ErrorMessage>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Delete</Form.Label>
                  <InputGroup>
                    <Button
                      onClick={() =>
                        setFieldValue(
                          'competencies',
                          values.competencies.filter((_, i) => i !== index),
                        )
                      }
                    >
                      Delete
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
          ))
        ) : (
          <Row>
            <Col
              style={{
                textAlign: 'center',
                color:
                  touched.competencies && !!errors.competencies
                    ? 'red'
                    : undefined,
              }}
            >
              No competencies linked to this project
            </Col>
          </Row>
        )}
      </Card.Body>
      <Card.Footer>
        <Button
          onClick={() =>
            setFieldValue('competencies', [...values.competencies, ''])
          }
        >
          <img
            alt="Plus icon"
            src={plusIcon}
            height="16"
            className="d-inline-block align-center"
            style={{ paddingRight: '8px' }}
          />
          Add competency
        </Button>
      </Card.Footer>
    </Card>
  );
}

export default connector(CompetenciesSection);
