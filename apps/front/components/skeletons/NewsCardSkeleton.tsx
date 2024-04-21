'use client';

import { useEffect, useState, type ReactElement } from 'react';
import { Card } from 'react-bootstrap';

export function NewsCardSkeleton(): ReactElement {
  const [numLines, setNumLines] = useState(1);

  useEffect(() => {
    // Generate between 3 and 7 lines
    setNumLines(Math.floor(Math.random() * 4) + 3);
  }, []);

  return (
    <div className="my-3">
      <Card>
        <Card.Header>
          <Card.Title>
            <div className="skeleton-text" style={{ width: '10%' }} />
          </Card.Title>
        </Card.Header>
        <Card.Body>
          {Array.from({ length: numLines }).map((_, index) => (
            <div
              key={index}
              className="skeleton-text"
              style={{
                width: `${80 + Math.random() * 20}%`,
                marginBottom: '10px',
              }}
            />
          ))}
        </Card.Body>
        <Card.Footer>
          <div className="skeleton-text" style={{ width: '20%' }} />
        </Card.Footer>
      </Card>
    </div>
  );
}
