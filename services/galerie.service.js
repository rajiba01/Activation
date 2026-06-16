// src/services/galerie.service.js
import api from './api';

export const galerieService = {
  getAll: () => api.get('/galerie/galeries/'),
  
  getById: (id) => api.get(`/galerie/galeries/${id}/`),
  
  create: (data) => {
    // Si c'est déjà un FormData
    if (data instanceof FormData) {
      return api.post('/galerie/galeries/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    
    // Sinon, construire le FormData
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value === undefined || value === null) return;
      
      if (key === 'upload_images' && Array.isArray(value)) {
        value.forEach(file => {
          if (file instanceof File) formData.append('upload_images', file);
        });
      } 
      else if (typeof value !== 'object') {
        formData.append(key, value);
      }
    });
    
    return api.post('/galerie/galeries/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  update: (id, data) => {
    if (data instanceof FormData) {
      return api.patch(`/galerie/galeries/${id}/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.patch(`/galerie/galeries/${id}/`, data);
  },
  
  delete: (id) => api.delete(`/galerie/galeries/${id}/`),
};

// ✅ Ajouter aussi un export par défaut (optionnel mais sécurisant)
export default galerieService;