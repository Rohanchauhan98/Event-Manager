import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Set auth token
const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// User APIs
export const registerUser = async userData => {
  const response = await axios.post(`${API_URL}/register`, userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    setAuthToken(response.data.token);
  }
  return response.data;
};

export const loginUser = async userData => {
  const response = await axios.post(`${API_URL}/login`, userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    setAuthToken(response.data.token);
  }
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setAuthToken(null);
};

// Event APIs
export const getEvents = async () => {
  const response = await axios.get(`${API_URL}/events`);
  return response.data;
};

export const getEventById = async id => {
  const response = await axios.get(`${API_URL}/events/${id}`);
  return response.data;
};

export const createEvent = async eventData => {
  const response = await axios.post(`${API_URL}/events`, eventData);
  return response.data;
};

export const deleteEvent = async id => {
  const response = await axios.delete(`${API_URL}/events/${id}`);
  return response.data;
};