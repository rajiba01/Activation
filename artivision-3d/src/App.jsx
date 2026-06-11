import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { initDemoData } from './data/initDemoData';
import { useArtisteStore } from './store/useArtisteStore'; // 👈 AJOUTE CET IMPORT

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
import MesOeuvres from "./pages/artiste/MesOeuvres";
import MesChambres from "./pages/artiste/MesChambres";
import Scene from './components/3d/Scene';
import Galerie3D from './pages/Galerie3D';
import { initTestData } from "./data/initTestData";
import TestGalerie3D from "./pages/TestGalerie3D";

// Composant de protection des routes privées
function PrivateRoute({ isConnected, allowedRole, userRole, children }) {
  if (!isConnected) return <Navigate to="/login" replace />;
  if (allowedRole && userRole !== allowedRole) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Initialiser les données de démonstration au démarrage
  useEffect(() => {
    initDemoData();
    initTestData();
  }, []);

  // Création automatique d'une galerie de test si aucune n'existe
  useEffect(() => {
    const store = useArtisteStore.getState();
    
    if (store.chambres.length === 0) {
      console.log("🚀 Création automatique d'une galerie de test...");
      
      // Créer la galerie
      store.ajouterChambre({
        id: "auto_galerie_1",
        nom: "Galerie Automatique",
        description: "Galerie créée automatiquement pour les tests",
        localisation: "Paris, France",
        surface: "24 × 18 m",
        decor: "classique",
        prixEntree: 8,
        dureeAcces: "48h",
        nbOeuvresMax: 30,
        tarifMensuel: 69,
        dateCreation: new Date().toISOString().split("T")[0],
        nbVisiteursTotal: 0,
        revenus: 0,
        width: 24,
        depth: 18,
        wallColor: "#F5ECD7",
        headerVariant: "burg",
      });
      
      // Créer des œuvres de test
      setTimeout(() => {
        const oeuvresTest = [
          {
            titre: "Lumière d'Automne",
            prix: 450,
            technique: "Huile sur toile",
            dimensions: "80 × 60 cm",
            statut: "Publié",
            img: "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?w=400&h=300&fit=crop",
          },
          {
            titre: "Reflets Bleutés",
            prix: 280,
            technique: "Aquarelle",
            dimensions: "50 × 40 cm",
            statut: "Publié",
            img: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=300&fit=crop",
          },
          {
            titre: "Portail Doré",
            prix: 720,
            technique: "Acrylique",
            dimensions: "100 × 80 cm",
            statut: "Publié",
            img: "https://images.unsplash.com/photo-1582552938358-32d906df40cb?w=400&h=300&fit=crop",
          },
        ];
        
        oeuvresTest.forEach(oeuvre => {
          store.ajouterOeuvre({
            ...oeuvre,
            id: Date.now().toString() + Math.random(),
            galerieId: "auto_galerie_1",
            galerieName: "Galerie Automatique",
            dateRealisation: new Date().toISOString().split("T")[0],
            nbExemplaires: 1,
            tags: ["Test"],
            description: "Œuvre de test",
          });
        });
        
        console.log("✅ Galerie et œuvres créées automatiquement !");
        console.log("👉 Va sur http://localhost:3001/mes-chambres pour voir ta galerie");
      }, 100);
    }
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
        <Route path="/test-3d" element={<Scene />} />
        <Route path="/test-galerie" element={<TestGalerie3D />} />

        {/* ── Pages privées ── */}
        <Route
          path="/dashboard-user"
          element={
            <PrivateRoute isConnected={isConnected} allowedRole="visiteur" userRole={userRole}>
              <DashboardUser />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;