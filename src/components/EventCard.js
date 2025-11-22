import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const EventCard = ({ event }) => {
  return (
    <Card className="h-100">
      <Card.Img 
        variant="top" 
        src={event.image || 'https://via.placeholder.com/300x200'} 
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{event.title}</Card.Title>
        <Card.Text>
          <strong>Date:</strong> {format(new Date(event.date), 'MMM d, yyyy h:mm a')}<br />
          <strong>Location:</strong> {event.location}<br />
          <strong>Price:</strong> ${event.price.toFixed(2)}
        </Card.Text>
        <Button 
          as={Link} 
          to={`/events/${event._id}`} 
          variant="primary" 
          className="mt-auto"
        >
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
};

export default EventCard;