import {
  FormEvent,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Modal,
  Row,
} from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Option } from 'react-bootstrap-typeahead/types/types';
import binIcon from '../assets/binIcon.png';
import plusIcon from '../assets/plusIcon.png';
import { OrganizationDocument } from '../organization/utilsOrganization';
import { FormErrors, client } from '../utils';
import { Project, ProjectDocument, ProjectType } from './utilsProject';

type CreateProjectProps = {
  show: boolean;
  setShow: (showNew: boolean) => void;
  projects: ProjectDocument[];
  setProjects: (projects: ProjectDocument[]) => void;
  organizations: OrganizationDocument[];
  setOrganizations: (organizations: OrganizationDocument[]) => void;
  competencies: string[];
};

export default function CreateProject({
  show,
  setShow,
  projects,
  setProjects,
  organizations,
  setOrganizations,
  competencies,
}: CreateProjectProps): ReactElement {
  const emptyProject: Project = {
    role: '',
    title: '',
    description: '',
    competencies: [],
    link: '',
    type: ProjectType.Education,
    organization: {
      _id: '',
      name: '',
      description: '',
      location: '',
      website: '',
    },
    startDate: new Date(),
    endDate: new Date(),
  };
  const [newProject, setNewProject] = useState<Project>(emptyProject);
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectEndDate, setSelectEndDate] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const checkTimeStamp = (begin: Date, end: Date): boolean => {
    begin = new Date(begin);
    end = new Date(end);
    return begin.getTime() <= end.getTime();
  };

  const validateForm = useCallback(() => {
    const errors: FormErrors = {};
    if (!newProject.role) errors.role = 'Role is required';
    if (!newProject.title) errors.title = 'Title is required';
    if (!newProject.organization.name)
      errors.organizationName = 'Organization name is required';
    if (!newProject.organization.description)
      errors.organizationDescription = 'Organization description is required';
    if (!newProject.organization.location)
      errors.organizationLocation = 'Organization location is required';
    if (!newProject.organization.website)
      errors.organizationWebsite = 'Organization website is required';
    if (
      !newProject.organization.website?.startsWith('http://') &&
      !newProject.organization.website?.startsWith('https://')
    )
      errors.organizationWebsite =
        'Please enter the full URL (starting with "http://" or "https://")';
    if (!newProject.type) errors.type = 'Type is required';
    if (!newProject.startDate) errors.startDate = 'Start date is required';
    if (
      newProject.startDate &&
      newProject.endDate &&
      !checkTimeStamp(newProject.startDate, newProject.endDate)
    ) {
      errors.endDate = 'End date must be after start date';
      errors.startDate = 'Start date must be before end date';
    }
    if (!newProject.description) errors.description = 'Description is required';
    if (
      newProject.link &&
      !newProject.link?.startsWith('http://') &&
      !newProject.link?.startsWith('https://')
    )
      errors.link =
        'Please enter the full URL (starting with "http://" or "https://")';
    if (!newProject.competencies.length)
      errors.competencies = 'Competencies are required';
    if (newProject.competencies.length) {
      for (let i = 0; i < newProject.competencies.length; i++) {
        if (!newProject.competencies[i])
          errors['competency' + i] = 'Competency is required';
      }
    }

    return errors;
  }, [newProject]);

  const handleCreate = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);
    const errors = validateForm();

    if (Object.keys(errors).length) setErrors(errors);
    else if (!newProject.organization._id) {
      const organizationToPost: Partial<OrganizationDocument> =
        newProject.organization;
      delete organizationToPost._id;
      client
        .post('/organization', organizationToPost, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('loginToken')}`,
          },
        })
        .then((response) => {
          setOrganizations([
            ...organizations,
            response.data as OrganizationDocument,
          ]);
          client
            .post(
              '/project',
              {
                ...newProject,
                organization: response.data._id,
                endDate: selectEndDate ? newProject.endDate : undefined,
              },
              {
                headers: {
                  Authorization: `Bearer ${sessionStorage.getItem(
                    'loginToken',
                  )}`,
                },
              },
            )
            .then((response) => {
              alert('Project added');
              setProjects([...projects, response.data as ProjectDocument]);
              setNewProject(emptyProject);
              setShow(false);
            })
            .catch((error) => {
              alert(error);
              console.log(error);
            });
        })
        .catch((error) => {
          alert(error);
          console.log(error);
        });
      setSubmitted(false);
    } else {
      const organizationToCheck = organizations.find(
        (organization) => organization._id === newProject.organization._id,
      );
      if (
        organizationToCheck?.name !== newProject.organization.name ||
        organizationToCheck?.description !==
          newProject.organization.description ||
        organizationToCheck?.location !== newProject.organization.location ||
        organizationToCheck?.website !== newProject.organization.website
      ) {
        client
          .put(
            '/organization/' + newProject.organization._id,
            newProject.organization,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem('loginToken')}`,
              },
            },
          )
          .then((response) => {
            setOrganizations([
              ...organizations.filter(
                (organization) => organization._id !== response.data._id,
              ),
              response.data as OrganizationDocument,
            ]);
            client
              .post(
                '/project',
                {
                  ...newProject,
                  organization: response.data._id,
                  endDate: selectEndDate ? newProject.endDate : undefined,
                },
                {
                  headers: {
                    Authorization: `Bearer ${sessionStorage.getItem(
                      'loginToken',
                    )}`,
                  },
                },
              )
              .then((response) => {
                alert('Project added');
                setProjects([...projects, response.data as ProjectDocument]);
                setNewProject(emptyProject);
                setShow(false);
              })
              .catch((error) => {
                alert(error);
                console.log(error);
              });
          })
          .catch((error) => {
            alert(error);
            console.log(error);
          });
        setSubmitted(false);
      } else {
        client
          .post(
            '/project',
            {
              ...newProject,
              organization: newProject.organization._id,
              endDate: selectEndDate ? newProject.endDate : undefined,
            },
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem('loginToken')}`,
              },
            },
          )
          .then((response) => {
            alert('Project added');
            setProjects([...projects, response.data as ProjectDocument]);
            setNewProject(emptyProject);
            setShow(false);
          })
          .catch((error) => {
            alert(error);
            console.log(error);
          });
        setSubmitted(false);
      }
    }
  };

  useEffect(() => {
    setErrors(validateForm());
  }, [validateForm]);

  return (
    <Modal
      show={show}
      onHide={(): void => {
        setShow(false);
        setSubmitted(false);
      }}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>New project</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleCreate}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Control
              type="text"
              value={newProject.role}
              onChange={(event): void =>
                setNewProject({
                  ...newProject,
                  role: event.target.value,
                })
              }
              placeholder="Role"
              isValid={!errors.role && !!newProject.role}
              isInvalid={!!errors.role && (!!newProject.role || submitted)}
            />
            <Form.Control.Feedback type="invalid">
              {errors.role}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={newProject.title}
              onChange={(event): void =>
                setNewProject({
                  ...newProject,
                  title: event.target.value,
                })
              }
              placeholder="Title"
              isValid={!errors.title && !!newProject.title}
              isInvalid={!!errors.title && (!!newProject.title || submitted)}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>
          <Card>
            <Card.Title>Organization</Card.Title>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Typeahead
                    id="organizationName"
                    isValid={
                      !errors.organizationName && !!newProject.organization.name
                    }
                    isInvalid={
                      !!errors.organizationName &&
                      (!!newProject.organization.name || submitted)
                    }
                    allowNew
                    onInputChange={(text): void =>
                      setNewProject({
                        ...newProject,
                        organization: {
                          ...newProject.organization,
                          name: text,
                        },
                      })
                    }
                    onChange={(selected): void => {
                      if (selected.length)
                        setNewProject({
                          ...newProject,
                          organization: selected[0] as OrganizationDocument,
                        });
                    }}
                    selected={[newProject.organization.name as Option]}
                    labelKey={'name'}
                    options={organizations}
                    placeholder="Organization"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProject.organization.location}
                    onChange={(event): void =>
                      setNewProject({
                        ...newProject,
                        organization: {
                          ...newProject.organization,
                          location: event.target.value,
                        },
                      })
                    }
                    placeholder="Location"
                    isValid={
                      !errors.organizationLocation &&
                      !!newProject.organization.location
                    }
                    isInvalid={
                      !!errors.organizationLocation &&
                      (!!newProject.organization.location || submitted)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.organizationLocation}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Website</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProject.organization.website}
                    onChange={(event): void =>
                      setNewProject({
                        ...newProject,
                        organization: {
                          ...newProject.organization,
                          website: event.target.value,
                        },
                      })
                    }
                    placeholder="Website"
                    isValid={
                      !errors.organizationWebsite &&
                      newProject.organization.website?.length > 6
                    }
                    isInvalid={
                      !!errors.organizationWebsite &&
                      (newProject.organization.website?.length > 6 || submitted)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.organizationWebsite}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProject.organization.description}
                    onChange={(event): void =>
                      setNewProject({
                        ...newProject,
                        organization: {
                          ...newProject.organization,
                          description: event.target.value,
                        },
                      })
                    }
                    placeholder="Description"
                    isValid={
                      !errors.organizationDescription &&
                      !!newProject.organization.description
                    }
                    isInvalid={
                      !!errors.organizationDescription &&
                      (!!newProject.organization.description || submitted)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.organizationDescription}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select
              value={newProject.type}
              onChange={(event): void =>
                setNewProject({
                  ...newProject,
                  type: event.target.value as ProjectType,
                })
              }
            >
              <option disabled>Select a type</option>
              {Object.values(ProjectType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Row>
              <Col>
                <Form.Label>Start date</Form.Label>
                <Form.Control
                  type="date"
                  value={
                    new Date(newProject.startDate).toISOString().split('T')[0]
                  }
                  onChange={(event): void =>
                    setNewProject({
                      ...newProject,
                      startDate: new Date(event.target.value),
                    })
                  }
                  placeholder="Start date"
                  isValid={!errors.startDate && !!newProject.startDate}
                  isInvalid={
                    !!errors.startDate && (!!newProject.startDate || submitted)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.startDate}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>End date</Form.Label>
                  <InputGroup>
                    {!!selectEndDate && (
                      <>
                        <Form.Control
                          type="date"
                          value={
                            newProject.endDate
                              ? new Date(newProject.endDate)
                                  .toISOString()
                                  .split('T')[0]
                              : ''
                          }
                          onChange={(event): void =>
                            setNewProject({
                              ...newProject,
                              endDate: new Date(event.target.value),
                            })
                          }
                          placeholder="End date"
                          isValid={!errors.endDate}
                          isInvalid={!!errors.startDate && submitted}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.endDate}
                        </Form.Control.Feedback>
                      </>
                    )}
                    <Button
                      onClick={(): void => {
                        setSelectEndDate(!selectEndDate);
                        setNewProject({
                          ...newProject,
                          endDate: new Date(),
                        });
                      }}
                      style={{ marginLeft: '8px' }}
                    >
                      {selectEndDate ? (
                        <img
                          alt="Plus icon"
                          src={binIcon}
                          height="16"
                          className="d-inline-block align-center"
                          style={{ paddingRight: '8px' }}
                        />
                      ) : (
                        <>
                          <img
                            alt="Plus icon"
                            src={plusIcon}
                            height="16"
                            className="d-inline-block align-center"
                            style={{ paddingRight: '8px' }}
                          />
                          Add end date
                        </>
                      )}
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={newProject.description}
              onChange={(event): void =>
                setNewProject({
                  ...newProject,
                  description: event.target.value,
                })
              }
              placeholder="Description"
              isValid={!errors.description && !!newProject.description}
              isInvalid={
                !!errors.description && (!!newProject.description || submitted)
              }
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Link</Form.Label>
            <Form.Control
              type="text"
              value={newProject.link}
              onChange={(event): void =>
                setNewProject({
                  ...newProject,
                  link: event.target.value,
                })
              }
              placeholder="Link"
              isValid={
                !errors.link &&
                !!(!newProject.link || newProject.link.length > 6)
              }
              isInvalid={
                !!errors.link &&
                (!!(!newProject.link || newProject.link.length > 6) ||
                  submitted)
              }
            />
            <Form.Control.Feedback type="invalid">
              {errors.link}
            </Form.Control.Feedback>
          </Form.Group>
          <Card>
            <Card.Body>
              {newProject.competencies.length ? (
                newProject.competencies.map((_, index) => (
                  <Row key={index}>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Competency</Form.Label>
                        <Form.Control
                          type="text"
                          list="competenciesList"
                          value={newProject.competencies[index]}
                          onChange={(event): void =>
                            setNewProject({
                              ...newProject,
                              competencies: [
                                ...newProject.competencies.slice(0, index),
                                event.target.value,
                                ...newProject.competencies.slice(index + 1),
                              ],
                            })
                          }
                          placeholder="Competency"
                          isValid={
                            !errors['competency' + index] &&
                            !!newProject.competencies[index]
                          }
                          isInvalid={
                            !!errors['competency' + index] &&
                            (!!newProject.competencies[index] || submitted)
                          }
                        />
                        <datalist id="competenciesList">
                          {competencies.map((competency) => (
                            <option key={competency} value={competency} />
                          ))}
                        </datalist>
                        <Form.Control.Feedback type="invalid">
                          {errors['competency' + index]}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group className="mb-3">
                        <Form.Label>Delete</Form.Label>
                        <InputGroup>
                          <Button
                            onClick={(): void =>
                              setNewProject({
                                ...newProject,
                                competencies: [
                                  ...newProject.competencies.slice(0, index),
                                  ...newProject.competencies.slice(index + 1),
                                ],
                              })
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
                        !!errors.competencies &&
                        (!!newProject.competencies[0] || submitted)
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
                onClick={(): void =>
                  setNewProject({
                    ...newProject,
                    competencies: [...newProject.competencies, ''],
                  })
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
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">Add</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
