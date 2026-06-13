// src/services/commande.service.js
import api from './api';

export const commandeService = {
  getAll: () => api.get('/commandes/commands/'),
  
  getById: (id) => api.get(`/commandes/commands/${id}/`),
  
  create: (data) => api.post('/commandes/commands/', data),
  
  verifyOtp: (id, otp) => api.post(`/commandes/commands/${id}/verify_otp/`, { otp }),
  
  update: (id, data) => {
    console.log(`📤 Mise à jour commande ${id}:`, data);
    return api.patch(`/commandes/commands/${id}/`, data);
  },
  
  delete: (id) => api.delete(`/commandes/commands/${id}/`),
};

export default commandeService;