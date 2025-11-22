import React from 'react';
import { Alert } from 'react-bootstrap';

const CustomAlert = ({ variant, message, onClose }) => {
  return (
    <Alert variant={variant} onClose={onClose} dismissible>
      {message}
    </Alert>
  );
};

export default CustomAlert;