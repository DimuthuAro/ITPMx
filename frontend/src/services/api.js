import axios from 'axios';

const API_URL = "http://localhost:3000/api"; // Updated to match your backend port

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// User management

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

export const getUserByEmail = async (email) => {
  const response = await api.get(`/users/email/${email}`);
  return response.data;
}

export const createUser = async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};


// Ticket management
export const getTickets = async () => {
  const response = await api.get('/tickets');
  return response.data;
};

export const getTicketById = async (id) => {
  const response = await api.get(`/tickets/${id}`);
  return response.data;
}
export const createTicket = async (ticketData) => {
  const response = await api.post('/tickets', ticketData);
  return response.data;
};

export const updateTicket = async (id, ticketData) => {
  const response = await api.put(`/tickets/${id}`, ticketData);
  return response.data;
};

export const deleteTicket = async (id) => {
  const response = await api.delete(`/tickets/${id}`);
  return response.data;
};

// Payment management
export const getPayments = async () => {
  const response = await api.get('/payments');
  return response.data;
};

export const getPaymentById = async (id) => {
  const response = await api.get(`/payments/${id}`);
  return response.data;
};

export const createPayment = async (paymentData) => {
  const response = await api.post('/payments', paymentData);
  return response.data;
};

export const updatePayment = async (id, paymentData) => {
  const response = await api.put(`/payments/${id}`, paymentData);
  return response.data;
};

export const deletePayment = async (id) => {
  const response = await api.delete(`/payments/${id}`);
  return response.data;
};

// Note management
export const getNotes = async () => {
  const response = await api.get('/notes');
  return response.data;
};

export const getNoteById = async (id) => {
  const response = await api.get(`/notes/${id}`);
  return response.data;
};

export const createNote = async (noteData) => {
  const response = await api.post('/notes', noteData);
  return response.data;
};

export const updateNote = async (id, noteData) => {
  const response = await api.put(`/notes/${id}`, noteData);
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};

export default api;
