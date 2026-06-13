// src/services/gallerySync.service.js
import api from './api';

export const gallerySyncService = {
  // Récupérer les galeries pour les visiteurs (endpoint public)
  getPublishedGalleriesForVisitors: async () => {
    try {
      // Utilise l'endpoint public (pas besoin de token)
      const response = await api.get('/galerie/galeries/public/');
      console.log("📦 Galeries publiques chargées:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur chargement galeries visiteurs:", error);
      
      // Fallback: essayer l'endpoint normal si le public échoue
      try {
        const fallbackResponse = await api.get('/galerie/galeries/');
        // Filtrer côté front
        return fallbackResponse.data.filter(g => g.status === 'published' || g.is_published === true);
      } catch (e) {
        console.error("Fallback aussi échoué:", e);
        return [];
      }
    }
  },

  // Récupérer une galerie par son ID
  getGalleryById: async (id) => {
    try {
      const response = await api.get(`/galerie/galeries/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`❌ Galerie ${id} non trouvée:`, error);
      return null;
    }
  }
};