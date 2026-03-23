import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

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