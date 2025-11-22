import React from 'react';
import { Container, Card } from 'react-bootstrap';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Dashboard</h2>
      <Card>
        <Card.Body>
          <Card.Title>Welcome, {user?.name}</Card.Title>
          <Card.Text>
            <strong>Email:</strong> {user?.email}<br />
            You can now create and manage events.
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;