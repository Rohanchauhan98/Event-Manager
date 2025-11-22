import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container className="mt-5">
      <Card className="text-center p-4 bg-light">
        <Card.Body>
          <h1>Welcome to EventHub</h1>
          <p className="lead">
            Discover and manage events with our platform. Create your own events or join existing ones.
          </p>
          <div>
            <Button as={Link} to="/events" variant="primary" className="me-2">
              Browse Events
            </Button>
            <Button as={Link} to="/create-event" variant="success">
              Create Event
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Home;