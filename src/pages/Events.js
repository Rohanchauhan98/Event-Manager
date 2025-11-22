import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { getEvents } from '../api/events';
import EventCard from '../components/EventCard';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4">Upcoming Events</h2>
      <Row>
        {events.length > 0 ? (
          events.map(event => (
            <Col key={event._id} md={4} className="mb-4">
              <EventCard event={event} />
            </Col>
          ))
        ) : (
          <Col>
            <Alert variant="info">No events found</Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Events;