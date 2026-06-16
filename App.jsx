import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ChatAtelier from './pages/ChatAtelier';
// Importer toutes les pages
import Accueil from './pages/client/Accueil';
import Sidebar from './components/Sidebar';
import Login from './pages/login/Login';
import InscriptionUser from './pages/login/InscriptionUser';
import InscriptionArtiste from './pages/login/InscriptionArtiste';
import ChoixStyles from './pages/login/ChoixStyles';
import DashboardArtiste from './pages/artiste/DashboardArtiste';
import EspaceArtiste from './pages/artiste/EspaceArtiste';
import AjouterGalerie from './pages/artiste/AjouterGalerie';
import ListeCommandes from './pages/artiste/ListeCommandes';
import UserPage from './pages/client/UserPage';
import MesOeuvres from "./pages/artiste/MesOeuvres";
import MesChambres from "./pages/artiste/MesChambres";
import Galerie3D from './pages/Galerie3D';
import TestGalerie3D from "./pages/TestGalerie3D";
import MesAchats from './pages/client/MesAchats';
import MesPaiements from './pages/artiste/MesPaiements';

// Composant de protection des routes privées
function PrivateRoute({ isConnected, allowedRole, userRole, children }) {
  if (!isConnected) return <Navigate to="/login" replace />;
  if (allowedRole && userRole !== allowedRole) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // ✅ Initialisation désactivée - plus d'appels API automatiques
  useEffect(() => {
    console.log("🚀 ARTIVISION 3D - Application démarrée");
    console.log("💡 Utilise les formulaires pour créer des données");
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* ── Pages publiques ── */}
        <Route path="/" element={<Accueil />} />
        <Route path="/login" element={<Login setIsConnected={setIsConnected} setUserRole={setUserRole} />} />
        <Route path="/inscription-user" element={<InscriptionUser />} />
        <Route path="/inscription-artiste" element={<InscriptionArtiste />} />
        <Route path="/choix-styles" element={<ChoixStyles />} />
        <Route path="/dashboard-artiste" element={<DashboardArtiste />} />
        <Route path="/espace-artiste" element={<EspaceArtiste />} />
        <Route path="/ajouter-galerie" element={<AjouterGalerie />} />
        <Route path="/commandes" element={<ListeCommandes />} />
        <Route path="/user-page" element={<UserPage />} />
        <Route path="/mes-oeuvres" element={<MesOeuvres />} />
        <Route path="/mes-chambres" element={<MesChambres />} />
        <Route path="/galerie-3d/:galerieId" element={<Galerie3D />} />
        <Route path="/test-galerie" element={<TestGalerie3D />} />
        <Route path="/mes-achats" element={<MesAchats />} />
<Route path="/atelier-ia" element={<ChatAtelier />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;