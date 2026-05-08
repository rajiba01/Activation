import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

// Importer toutes les pages
import Accueil from './pages/client/Accueil';
import Login from './pages/login/Login';
import InscriptionUser from './pages/login/InscriptionUser';
import InscriptionArtiste from './pages/login/InscriptionArtiste';
import ChoixStyles from './pages/login/ChoixStyles';
import DashboardUser from './pages/DashboardUser';
import DashboardArtiste from './pages/artiste/DashboardArtiste';
import EspaceArtiste from './pages/artiste/EspaceArtiste';
import AjouterGalerie from './pages/artiste/AjouterGalerie';
import ListeCommandes from './pages/artiste/ListeCommandes';
import UserPage from './pages/client/UserPage';
import MesOeuvres  from "./pages/artiste/MesOeuvres";
import MesChambres from "./pages/artiste/MesChambres";
import Scene from './components/3d/Scene';

// Composant de protection des routes privées
function PrivateRoute({ isConnected, allowedRole, userRole, children }) {
  if (!isConnected) return <Navigate to="/login" replace />;
  if (allowedRole && userRole !== allowedRole) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [userRole, setUserRole] = useState(null); // "artiste" | "visiteur"

  return (
    <BrowserRouter>
      <Routes>

        {/* ── Pages publiques ── */}
        <Route path="/"                    element={<Accueil />} />
        <Route path="/login"               element={<Login setIsConnected={setIsConnected} setUserRole={setUserRole} />} />
        <Route path="/inscription-user"    element={<InscriptionUser />} />
        <Route path="/inscription-artiste" element={<InscriptionArtiste />} />
        <Route path="/choix-styles"        element={<ChoixStyles />} />
        <Route path="/dashboard-artiste" element={<DashboardArtiste />} />
        <Route path="/espace-artiste" element={<EspaceArtiste />} />
        <Route path="/ajouter-galerie" element={<AjouterGalerie />} />
        <Route path="/commandes" element={<ListeCommandes />} />
        <Route path="/user-page" element={<UserPage />} />
        <Route path="/mes-oeuvres"   element={<MesOeuvres />} />
        <Route path="/mes-chambres"  element={<MesChambres />} />

        <Route path="/scene" element={<Scene />} />

        {/* ── Pages privées ── */}
        <Route
          path="/dashboard-user"
          element={
            <PrivateRoute isConnected={isConnected} allowedRole="visiteur" userRole={userRole}>
              <DashboardUser />
            </PrivateRoute>
          }
        />
 {/* ── Pages privées ── 
        <Route
          path="/dashboard-artiste"
          element={
            <PrivateRoute isConnected={isConnected} allowedRole="artiste" userRole={userRole}>
              <DashboardArtiste />
            </PrivateRoute>
          }
        />*/}

      

      </Routes>
    </BrowserRouter>
  );
}

export default App;