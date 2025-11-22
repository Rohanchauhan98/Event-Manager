import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { getEventById, deleteEvent } from '../api/events';
import { format } from 'date-fns';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(id);
        setEvent(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Event not found');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteEvent(id);
      navigate('/events');
    } catch (err) {
      setError('Failed to delete event');
    }
  };

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
      {event && (
        <Card>
          <Card.Img 
            variant="top" 
            src={event.image || 'https://via.placeholder.com/800x400'} 
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
          <Card.Body>
            <Card.Title>{event.title}</Card.Title>
            <Card.Text className="mb-4">
              <strong>Date:</strong> {format(new Date(event.date), 'MMMM d, yyyy h:mm a')}<br />
              <strong>Location:</strong> {event.location}<br />
              <strong>Price:</strong> ${event.price.toFixed(2)}<br />
              <strong>Description:</strong> {event.description}
            </Card.Text>
            <div className="d-flex justify-content-between">
              <Button variant="primary" onClick={() => navigate('/events')}>
                Back to Events
              </Button>
              {localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))._id === event.createdBy._id && (
                <Button variant="danger" onClick={handleDelete}>
                  Delete Event
                </Button>
              )}
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default EventDetail;