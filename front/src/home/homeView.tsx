import { ReactElement, useEffect, useState } from 'react';
import { Data, client } from '../utils';
import { Card, Col, Row } from 'react-bootstrap';

export default function HomeView(): ReactElement {
  const [datas, setDatas] = useState<Data[]>([]);

  useEffect(() => {
    client
      .get('/data')
      .then((response) => setDatas(response.data as Data[]))
      .catch((error) => console.log(error));
  });

  return (
    <>
      {datas.length ? (
        datas.map((data) => (
          <Row style={{ paddingBottom: '8px' }} key={data.name}>
            <Col>
              <Card>
                <Card.Header>
                  <Card.Title>{data.name}</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Card.Text>{data.content}</Card.Text>
                </Card.Body>
                <Card.Footer>
                  {new Date(data.date).toLocaleDateString()}
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        ))
      ) : (
        <i>Nothing to display</i>
      )}
    </>
  );
}
