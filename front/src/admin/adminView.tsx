import { FormEvent, ReactElement, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Data, client } from '../utils';

export default function AdminView(): ReactElement {
  const [newData, setNewData] = useState<Data>({
    name: '',
    content: '',
    date: new Date(),
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log(newData);

    client
      .post('/data', newData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('loginToken')}`,
        },
      })
      .then(() => {
        alert('Data added');
        setNewData({
          name: '',
          content: '',
          date: new Date(),
        });
      })
      .catch((error) => alert(error));
  };

  return (
    <>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <Card>
              <Card.Header>
                <Card.Title>Add data</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newData.name}
                    onChange={(event): void =>
                      setNewData({
                        ...newData,
                        name: event.target.value,
                      })
                    }
                    placeholder="Enter name"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Content</Form.Label>
                  <Form.Control
                    type="text"
                    value={newData.content}
                    onChange={(event): void =>
                      setNewData({
                        ...newData,
                        content: event.target.value,
                      })
                    }
                    placeholder="Enter content"
                  />
                </Form.Group>
              </Card.Body>
              <Card.Footer>
                <Button variant="primary" type="submit">
                  Add
                </Button>
              </Card.Footer>
            </Card>
          </Form>
        </Col>
      </Row>
    </>
  );
}
