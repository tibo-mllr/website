import { projectSchema } from '@website/shared-types';
import { Formik } from 'formik';
import { type ReactElement, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import { type AppState } from 'reducers/types';
import { client } from 'utils';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import ProjectForm from './ProjectForm';
import {
  Project,
  handleOrganization,
  type ProjectDocument,
} from './utilsProject';

type EditProjectProps = {
  projectToEdit: ProjectDocument;
  show: boolean;
  setShow: (show: boolean) => void;
};

const stateProps = (
  state: AppState,
): Pick<
  AppState['organizationReducer'] & AppState['adminReducer'],
  'organizations' | 'token'
> => ({
  organizations: state.organizationReducer.organizations,
  token: state.adminReducer.token,
});

const connector = connect(stateProps);

export function EditProjectModal({
  projectToEdit,
  show,
  setShow,
  organizations,
  token,
}: EditProjectProps & ConnectedProps<typeof connector>): ReactElement {
  const [selectEndDate, setSelectEndDate] = useState<boolean>(
    !!projectToEdit.endDate,
  );

  const checkTimeStamp = (begin: Date, end: Date): boolean => {
    begin = new Date(begin);
    end = new Date(end);
    return begin.getTime() <= end.getTime();
  };

  const handleEdit = async (values: Project): Promise<void> => {
    console.log('values', values);
    const organizationId = await handleOrganization(
      organizations,
      values.organization,
      token,
    );

    try {
      await client.put<ProjectDocument>(
        '/project/' + projectToEdit._id,
        {
          ...values,
          organization: organizationId,
          endDate: selectEndDate ? values.endDate : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert('Project edited');
      setShow(false);
    } catch (error) {
      alert(error);
      console.error(error);
    }
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit project</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{
          ...projectToEdit,
          startDate: new Date(projectToEdit.startDate),
          endDate: projectToEdit.endDate
            ? new Date(projectToEdit.endDate)
            : undefined,
          organization: projectToEdit.organization ?? {
            _id: '',
            name: '',
            description: '',
            location: '',
            website: '',
          },
        }}
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
        onSubmit={handleEdit}
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
            organization={projectToEdit.organization}
            edit
          />
        )}
      </Formik>
    </Modal>
  );
}

export default connector(EditProjectModal);
