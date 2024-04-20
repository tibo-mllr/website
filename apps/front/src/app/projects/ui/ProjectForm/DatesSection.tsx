'use client';

import { binIcon, plusIcon } from '@/app/ui/assets';
import { DatePicker, DatePickerWithLabel } from '@/components';
import {
  type OrganizationDocument,
  type Project,
  type ProjectDocument,
} from '@/lib/utils';
import { useFormikContext } from 'formik';
import Image from 'next/image';
import { ReactElement } from 'react';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';

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
    <Form.Group className="mb-3">
      <Row>
        <Col>
          <DatePickerWithLabel
            name="startDate"
            label="Start date"
            groupClassName="mb-3"
          />
        </Col>
        <Col>
          <Row>
            <Form.Group className="mb-3">
              <Form.Label>End date</Form.Label>
              {!!selectEndDate ? (
                <InputGroup>
                  <DatePicker name="endDate" tooltipError />
                  <Button
                    onClick={() => {
                      setSelectEndDate(!selectEndDate);
                      setFieldValue('endDate', new Date());
                    }}
                  >
                    <Image alt="Bin icon" src={binIcon} height="16" />
                  </Button>
                </InputGroup>
              ) : (
                <Col>
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
                </Col>
              )}
            </Form.Group>
          </Row>
        </Col>
      </Row>
    </Form.Group>
  );
}
