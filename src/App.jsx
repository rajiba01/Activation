import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/userContext';  // 🆕 Importer AuthProvider
import { useAuth } from './hook/userHook';  // 🆕 Importer le hook

// Importer toutes les pages
import Accueil from './pages/Accueil';
import Login from './pages/Login';
import InscriptionUser from './pages/InscriptionUser';
import InscriptionArtiste from './pages/InscriptionArtiste';
import ChoixStyles from './pages/ChoixStyles';
import DashboardUser from './pages/DashboardUser';
import DashboardArtiste from './pages/DashboardArtiste';
import EspaceArtiste from './pages/EspaceArtiste';
import AjouterGalerie from './pages/AjouterGalerie';
import ListeCommandes from './pages/ListeCommandes';

// Composant pour protéger les routes privées
function PrivateRoute({ allowedRole, children }) {
  const { token, user } = useAuth();  // 🆕 Récupérer token et user du Context
  
  // ✅ Si pas connecté, aller à login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // ✅ Si rôle requis et pas bon rôle, aller à login
  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }
  
  // ✅ Sinon, afficher le composant
  return children;
}

// 🆕 Composant interne (utilise le hook)
function AppRoutes() {
  return (
    <Routes>

      {/* ── Pages publiques ── */}
      <Route path="/" element={<Accueil />} />
      <Route path="/login" element={<Login />} />
      <Route path="/inscription-user" element={<InscriptionUser />} />
      <Route path="/inscription-artiste" element={<InscriptionArtiste />} />
      <Route path="/choix-styles" element={<ChoixStyles />} />

      {/* ── Pages privées (visiteur) ── */}
      <Route
        path="/dashboard-user"
        element={
          <PrivateRoute allowedRole="visiteur">
            <DashboardUser />
          </PrivateRoute>
        }
      />

      {/* ── Pages privées (artiste) ── */}
      <Route
        path="/dashboard-artiste"
        element={
          <PrivateRoute allowedRole="artiste">
            <DashboardArtiste />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/espace-artiste"
        element={
          <PrivateRoute allowedRole="artiste">
            <EspaceArtiste />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/ajouter-galerie"
        element={
          <PrivateRoute allowedRole="artiste">
            <AjouterGalerie />
          </PrivateRoute>
        }
      />

      {/* ── Pages privées (tous connectés) ── */}
      <Route
        path="/commandes"
        element={
          <PrivateRoute>
            <ListeCommandes />
          </PrivateRoute>
        }
      />

    </Routes>
  );
}

// 🆕 Composant principal
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>  {/* 🆕 ENVELOPPER TOUT AVEC LE PROVIDER */}
        <AppRoutes />
      </AuthProvider>  {/* 🆕 FERMER LE PROVIDER */}
    </BrowserRouter>
  );
}

export default App;