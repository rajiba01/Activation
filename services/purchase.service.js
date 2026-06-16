// src/services/purchase.service.js
import api from './api';

export const purchaseService = {
  purchaseGalleryAccess: async (galleryId) => {
    return api.post('/purchases/access/purchase_access/', {
      gallery_id: galleryId,
      role: 'visiteur'
    });
  },

  purchaseArtistGalleryAccess: async (galleryId) => {
    return api.post('/purchases/access/purchase_access/', {
      gallery_id: galleryId,
      role: 'artiste'
    });
  },

  createArtworkOrder: async (artworkId, galleryId = null) => {
    const payload = { oeuvres: [artworkId] };
    if (galleryId) payload.galerie = galleryId;
    return api.post('/commandes/commands/', payload);
  },

  checkAccess: async (galleryId, role = 'visiteur') => {
    try {
      const response = await api.get('/purchases/access/check_access/', {
        params: { gallery_id: galleryId, role: role }
      });
      return response.data;
    } catch (error) {
      return { has_access: false, remaining_seconds: null };
    }
  },

  getUserAccesses: async (role = null) => {
    try {
      const response = await api.get('/purchases/access/');
      let data = response.data;
      if (role) data = data.filter(a => a.role === role);
      return data;
    } catch (error) {
      return [];
    }
  },

  getUserOrders: async () => {
    try {
      const response = await api.get('/commandes/commands/');
      return response.data;
    } catch (error) {
      return [];
    }
  },

  verifyOrderOtp: async (orderId, otp) => {
    return api.post(`/commandes/commands/${orderId}/verify_otp/`, { otp });
  },

  getArtworkPurchases: async () => {
    try {
      const response = await api.get('/purchases/artworks/');
      return response.data;
    } catch (error) {
      return [];
    }
  },

  markArtworkAsSold: async (artworkId) => {
    try {
      const response = await api.patch(`/galerie/oeuvres/${artworkId}/`, { 
        statut: "Vendu" 
      });
      console.log(`✅ Œuvre ${artworkId} marquée comme vendue`);
      return response;
    } catch (error) {
      console.error(`❌ Erreur marquage ${artworkId}:`, error.response?.data || error);
      throw error;
    }
  },

  getAvailableArtworks: async (galleryId) => {
    try {
      const response = await api.get(`/galerie/oeuvres/`, {
        params: { galerie: galleryId }
      });
      
      let toutesOeuvres = [];
      if (response.data?.data && Array.isArray(response.data.data)) {
        toutesOeuvres = response.data.data;
      } else if (Array.isArray(response.data)) {
        toutesOeuvres = response.data;
      } else if (response.data?.results && Array.isArray(response.data.results)) {
        toutesOeuvres = response.data.results;
      } else {
        toutesOeuvres = [];
      }
      
      const oeuvresDisponibles = toutesOeuvres.filter(oeuvre => {
        return oeuvre.statut !== "Vendu" && oeuvre.statut !== "vendu";
      });
      
      return oeuvresDisponibles;
    } catch (error) {
      console.error(`❌ Erreur:`, error);
      return [];
    }
  },
  purchaseArtistSubscription: async (subscriptionType) => {
  return api.post('/purchases/access/purchase_access/', {
    role: 'artiste',
    subscription_type: subscriptionType  // 'atelier', 'galerie', 'musee'
  });
},
checkAccess: async (galleryId, role = 'visiteur') => {
  try {
    const response = await api.get('/purchases/access/check_access/', {
      params: { gallery_id: galleryId, role: role }
    });
    return response.data;
  } catch (error) {
    // Si l'endpoint n'existe pas (404), retourner false par défaut
    if (error.response?.status === 404) {
      console.log("ℹ️ Endpoint check_access non disponible, accès considéré comme non acheté");
      return { has_access: false, remaining_seconds: null };
    }
    console.error("Erreur vérification accès:", error);
    return { has_access: false, remaining_seconds: null };
  }
},
};

export default purchaseService;