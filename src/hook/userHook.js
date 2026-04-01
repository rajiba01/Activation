import { useContext } from 'react';
import { AuthContext } from '../context/userContext';  // 🆕 Corriger le chemin

// ✅ Étape 1 : Créer le hook
export const useAuth = () => {
  // ✅ Étape 2 : Accéder au contexte
  const context = useContext(AuthContext);
  // Cela récupère 'value' du Provider
  
  // ✅ Étape 3 : Vérifier que le hook est bien utilisé
  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider');
    // Si on oublie le Provider, ça fait une erreur
  }
  
  // ✅ Étape 4 : Retourner le contexte
  return context;
  // { user, token, loading, error, login, logout }
};