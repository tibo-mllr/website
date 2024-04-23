import { binIcon, editIcon } from '@/app/ui/assets';
import Image from 'next/image';
import { type ReactElement } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';

export function UserCardSkeleton(): ReactElement {
  return (
    <div className="my-3">
      <Card>
        <Card.Header>
          <Card.Title>
            <div className="skeleton-text" style={{ width: '10%' }} />
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div
            className="skeleton-text"
            style={{
              width: '10%',
              marginBottom: '10px',
            }}
          />
        </Card.Body>
        <Card.Footer>
          <Row>
            <Col>
              <Button>
                <Image
                  alt="Edit"
                  src={editIcon}
                  height="24"
                  className="d-inline-block align-center"
                />
              </Button>
            </Col>
            <Col className="d-flex justify-content-end">
              <Button>
                <Image
                  alt="Delete"
                  src={binIcon}
                  height="24"
                  className="d-inline-block align-center"
                />
              </Button>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    </div>
  );
}
