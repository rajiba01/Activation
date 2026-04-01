const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const apiClient = {
  // 📝 Enregistrement utilisateur
  register: async (userData) => {
    // 🆕 Mapper les champs du frontend vers le backend
    const backendData = {
      username: userData.username,    // ✅ username (pas pseudo)
      password: userData.password,    // ✅ password (pas mdp)
      nom: userData.nom,              // ✅ nom
      prenom: userData.prenom,        // ✅ prenom
      email: userData.email,          // ✅ email
      role: userData.role,            // ✅ role
    };

    console.log('📤 Données d\'inscription envoyées:', backendData);

    const endpoint = userData.role === 'artiste' 
      ? `${API_BASE_URL}/accounts/register/artist/`
      : `${API_BASE_URL}/accounts/register/user/`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erreur inscription');
    }
    return response.json();
  },

  // 🔐 Connexion
  login: async (username, password) => {
    // 🆕 Envoyer directement username et password (pas de mapping)
    const loginData = {
      username: username,   // ✅ username directement
      password: password,   // ✅ password directement
    };

    console.log('📤 Données de connexion envoyées:', loginData);

    const response = await fetch(`${API_BASE_URL}/accounts/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    });

    console.log(' Status réponse login:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.log(' Erreur backend:', error);
      throw new Error(error.detail || 'Identifiants invalides');
    }
    
    const data = await response.json();
    console.log(' Réponse login réussie:', data);
    
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    
    return data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  // 🔄 Rafraîchir le token JWT
  refreshToken: async () => {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) {
      throw new Error('Pas de refresh token');
    }

    const response = await fetch(`${API_BASE_URL}/accounts/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refresh_token }),
    });

    if (!response.ok) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
      throw new Error('Token expiré');
    }

    const data = await response.json();
    localStorage.setItem('access_token', data.access);
    return data.access;
  },

  // 📝 Requête authentifiée avec JWT
  authenticatedFetch: async (endpoint, options = {}) => {
    let token = localStorage.getItem('access_token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      try {
        token = await apiClient.refreshToken();
        headers['Authorization'] = `Bearer ${token}`;
        
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
        });
      } catch (error) {
        window.location.href = '/login';
        throw error;
      }
    }

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  },

  // 👤 Utilisateurs
  getUser: async (userId) => {
    return apiClient.authenticatedFetch(`/accounts/users/${userId}/`);
  },

  listUsers: async () => {
    return apiClient.authenticatedFetch('/accounts/users/');
  },

  updateUser: async (userId, userData) => {
    return apiClient.authenticatedFetch(`/accounts/users/${userId}/update/`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (userId) => {
    return apiClient.authenticatedFetch(`/accounts/users/${userId}/delete/`, {
      method: 'DELETE',
    });
  },

  // 🎨 Artistes
  getArtist: async (artistId) => {
    return apiClient.authenticatedFetch(`/accounts/artists/${artistId}/`);
  },

  listArtists: async () => {
    return apiClient.authenticatedFetch('/accounts/artists/');
  },

  updateArtist: async (artistId, artistData) => {
    return apiClient.authenticatedFetch(`/accounts/artists/${artistId}/update/`, {
      method: 'POST',
      body: JSON.stringify(artistData),
    });
  },

  deleteArtist: async (artistId) => {
    return apiClient.authenticatedFetch(`/accounts/artists/${artistId}/delete/`, {
      method: 'DELETE',
    });
  },

  // 📦 Annonces
  getAnnonces: async () => {
    return apiClient.authenticatedFetch('/annonces/');
  },

  getAnnonceById: async (annonceId) => {
    return apiClient.authenticatedFetch(`/annonces/${annonceId}/`);
  },

  createAnnonce: async (annonceData) => {
    return apiClient.authenticatedFetch('/annonces/create/', {
      method: 'POST',
      body: JSON.stringify(annonceData),
    });
  },

  updateAnnonce: async (annonceId, annonceData) => {
    return apiClient.authenticatedFetch(`/annonces/${annonceId}/update/`, {
      method: 'POST',
      body: JSON.stringify(annonceData),
    });
  },

  deleteAnnonce: async (annonceId) => {
    return apiClient.authenticatedFetch(`/annonces/${annonceId}/delete/`, {
      method: 'DELETE',
    });
  },
};