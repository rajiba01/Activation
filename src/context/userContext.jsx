import React, { createContext, useState } from 'react';
import { apiClient } from '../services/api';


export const AuthContext = createContext();



export const AuthProvider = ({ children }) => {

  
  // ✅ Étape 4 : Déclarer l'état (données)
  const [user, setUser] = useState(null);
  // user = null au départ, setUser = fonction pour modifier
  
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  // Récupérer le token du localStorage s'il existe
  
  const [loading, setLoading] = useState(false);
  // loading = true pendant l'API call, false quand fini
  
  const [error, setError] = useState(null);
  // error = message d'erreur s'il y a un problème

  // 🔐 FONCTION 1 : Connexion
  const login = async (username, password) => {
    // 'async' = fonction asynchrone (elle peut attendre)
    
    setLoading(true); // ✅ Dire "on est en train de charger"
    setError(null);   // ✅ Réinitialiser les erreurs
    
    try {
      // ✅ Appeler l'API pour login
      const data = await apiClient.login(username, password);
      // 'await' = attendre la réponse de l'API
      
      // ✅ Si réussi : sauvegarder le token
      setToken(data.access);
      
      // ✅ Sauvegarder l'utilisateur
      setUser(data);
      
      return data; // ✅ Retourner les données
      
    } catch (err) {
      // ✅ Si erreur : afficher le message
      setError(err.message);
      throw err; // ✅ Re-lancer l'erreur
      
    } finally {
      // ✅ Dans tous les cas (réussi ou erreur)
      setLoading(false); // ✅ Dire "chargement fini"
    }
  };

  // 📝 FONCTION 2 : Inscription (NOUVELLE)
  const register = async (userData) => {
    // 🆕 userData contient : nom, prenom, username, email, password, role, etc.
    setLoading(true);
    setError(null);
    
    try {
      // ✅ Appeler apiClient.register()
      const data = await apiClient.register(userData);
      
      // ✅ Optionnel : connecter automatiquement l'utilisateur
      // await login(userData.username, userData.password);
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🚪 FONCTION 3 : Déconnexion
  const logout = () => {
    apiClient.logout(); // ✅ Appeler API logout
    setUser(null);      // ✅ Supprimer l'utilisateur
    setToken(null);     // ✅ Supprimer le token
  };

  // ✅ Étape 5 : Créer l'objet value (ce qu'on partage)
  const value = {
    user,      // Les infos utilisateur
    token,     // Le token JWT
    loading,   // État de chargement
    error,     // Erreurs
    login,     // Fonction de connexion
    register,  // 🆕 Ajouter register
    logout,    // Fonction de déconnexion
  };

  // ✅ Étape 6 : Retourner le Provider avec les données
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};