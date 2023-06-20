import { ReactElement } from 'react';
import { Button } from 'react-bootstrap';
import { client } from '../utils';

export default function HomeView(): ReactElement {
  const addTest = (): void => {
    client
      .post('/data', { name: 'test', content: 'test' })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  };

  return <Button onClick={addTest}>Test</Button>;
}
