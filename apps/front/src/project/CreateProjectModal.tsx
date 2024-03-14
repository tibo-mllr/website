import { PartialBy, ProjectType, projectSchema } from '@website/shared-types';
import { Formik } from 'formik';
import { type ReactElement, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import { switchShowNewProject } from 'reducers/slices';
import { type AppState } from 'reducers/types';
import { client } from 'utils';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import ProjectForm from './ProjectForm';
import {
  handleOrganization,
  type Project,
  type ProjectDocument,
} from './utilsProject';

const stateProps = (
  state: AppState,
): Pick<
  AppState['projectReducer'] &
    AppState['organizationReducer'] &
    AppState['adminReducer'],
  'showNew' | 'organizations' | 'token'
> => ({
  showNew: state.projectReducer.showNew,
  organizations: state.organizationReducer.organizations,
  token: state.adminReducer.token,
});

const dispatchProps = { setShow: switchShowNewProject };

const connector = connect(stateProps, dispatchProps);

export function CreateProjectModal({
  showNew,
  organizations,
  token,
  setShow,
}: ConnectedProps<typeof connector>): ReactElement {
  const emptyProject: Project = {
    role: '',
    title: '',
    description: '',
    competencies: [],
    link: undefined,
    type: ProjectType.Education,
    organization: {
      _id: '',
      name: '',
      description: '',
      location: '',
      website: '',
    },
    startDate: new Date(),
    endDate: undefined,
  };
  const [selectEndDate, setSelectEndDate] = useState<boolean>(false);

  const checkTimeStamp = (begin: Date, end: Date): boolean => {
    begin = new Date(begin);
    end = new Date(end);
    return begin.getTime() <= end.getTime();
  };

  const handleCreate = async (
    newProject: PartialBy<Project, 'organization'>,
  ): Promise<void> => {
    const organizationId = await handleOrganization(
      organizations,
      newProject.organization,
      token,
    );

    try {
      await client.post<ProjectDocument>(
        '/project',
        {
          ...newProject,
          organization: organizationId,
          endDate: selectEndDate ? newProject.endDate : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert('Project added');
      setShow(false);
    } catch (error) {
      alert(error);
      console.error(error);
    }
  };

  return (
    <Modal show={showNew} onHide={() => setShow(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>New project</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={emptyProject}
        validationSchema={toFormikValidationSchema(projectSchema)}
        validate={(values) => {
          if (
            values.endDate &&
            !checkTimeStamp(values.startDate, values.endDate)
          ) {
            return { endDate: 'End date must be after start date' };
          }
          return {};
        }}
        onSubmit={handleCreate}
      >
        {({
          values,
          touched,
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldTouched,
          setFieldValue,
        }) => (
          <ProjectForm
            values={values}
            touched={touched}
            errors={errors}
            handleBlur={handleBlur}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
            selectEndDate={selectEndDate}
            setSelectEndDate={setSelectEndDate}
            create
          />
        )}
      </Formik>
    </Modal>
  );
}

export default connector(CreateProjectModal);
