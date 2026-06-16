// src/services/avis.service.js
import api from './api';

export const avisService = {
  getAll: () => api.get('/avis/'),
  create: (data) => api.post('/avis/', data),
};

export default avisService;