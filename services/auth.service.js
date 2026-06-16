// src/services/auth.service.js
import api from './api';

export const authService = {
  // Connexion
  login: async (username, password) => {
    console.log("📤 Tentative de connexion:", { username, password });
    
    try {
      const response = await api.post('/accounts/login/', { 
        username: username, 
        password: password 
      });
      
      console.log("📦 Réponse login:", response.data);
      
      if (response.data?.data?.access) {
        localStorage.setItem('access_token', response.data.data.access);
        localStorage.setItem('refresh_token', response.data.data.refresh);
        console.log("✅ Tokens sauvegardés");
      }
      
      return response;
    } catch (error) {
      console.error("❌ Erreur login:", error.response?.data || error);
      throw error;
    }
  },

  // Inscription visiteur
  registerUser: async (data) => {
    const payload = {
      pseudo: data.pseudo,
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      mdp: data.mdp,
      ville: data.ville || '',
      tel: data.tel || '',
    };
    return api.post('/accounts/register/user/', payload);
  },

  // Inscription artiste
  registerArtist: async (data) => {
    const payload = {
      pseudo: data.pseudo,
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      mdp: data.mdp,
      biographie: data.biographie || '',
      style_art: data.style_art || '',
    };
    
    if (data.photo && data.photo instanceof File) {
      const formData = new FormData();
      formData.append('pseudo', data.pseudo);
      formData.append('nom', data.nom);
      formData.append('prenom', data.prenom);
      formData.append('email', data.email);
      formData.append('mdp', data.mdp);
      formData.append('biographie', data.biographie || '');
      formData.append('style_art', data.style_art || '');
      formData.append('photo', data.photo);
      
      return api.post('/accounts/register/artist/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    
    return api.post('/accounts/register/artist/', payload);
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  // Récupérer l'utilisateur courant
  getCurrentUser: () => api.get('/accounts/users/me/'),
  getUserRole: async () => {
  return api.get('/accounts/users/me/role/');
},
};