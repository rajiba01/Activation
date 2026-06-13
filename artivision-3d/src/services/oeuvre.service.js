// src/services/oeuvre.service.js
import api from './api';

export const oeuvreService = {
  getAll: () => api.get('/galerie/oeuvres/'),
  
  getById: (id) => api.get(`/galerie/oeuvres/${id}/`),
  
  getByGalerie: (galerieId) => api.get(`/galerie/oeuvres/?galerie=${galerieId}`),
  
  create: (data) => {
    if (data instanceof FormData) {
      return api.post('/galerie/oeuvres/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    
    const payload = {
      titre: data.titre,
      description: data.description,
      prix: parseFloat(data.prix),
      technique: data.technique,
      dimensions: data.dimensions || "",
      date_realisation: data.date_realisation,
      statut: data.statut || "Publié",
      nb_exemplaires: parseInt(data.nb_exemplaires) || 1,
      galerie: parseInt(data.galerie),
    };
    
    if (data.img && typeof data.img === 'string' && data.img.trim() !== '') {
      payload.img = data.img;
    }
    
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined || payload[key] === "") {
        delete payload[key];
      }
    });
    
    return api.post('/galerie/oeuvres/', payload);
  },
  
  update: (id, data) => {
    if (data instanceof FormData) {
      return api.patch(`/galerie/oeuvres/${id}/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.patch(`/galerie/oeuvres/${id}/`, data);
  },
  
  delete: (id) => api.delete(`/galerie/oeuvres/${id}/`),
};

export default oeuvreService;