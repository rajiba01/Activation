// src/pages/TestGalerie3D.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useArtisteStore } from "../store/useArtisteStore";

export default function TestGalerie3D() {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const [testGalerieId, setTestGalerieId] = useState(null);
  const [nbOeuvres, setNbOeuvres] = useState(0);
  const hasInitialized = useRef(false);
  
  // Récupérer depuis le store
  const chambres = useArtisteStore((state) => state.chambres);
  const oeuvres = useArtisteStore((state) => state.oeuvres);
  const ajouterChambre = useArtisteStore((state) => state.ajouterChambre);
  const ajouterOeuvre = useArtisteStore((state) => state.ajouterOeuvre);
  const supprimerChambre = useArtisteStore((state) => state.supprimerChambre);
  
  // Données de test avec un ID unique basé sur timestamp
  const getUniqueId = () => `test_galerie_${Date.now()}`;
  
  const TEST_GALERIE = {
    id: "test_galerie_fixed",
    nom: "🎨 Galerie Test 3D",
    description: "Galerie de test pour visualiser les œuvres sur les murs",
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
  };

  const TEST_OEUVRES = [
    {
      id: "test_oeuvre_1",
      galerieId: "test_galerie_fixed",
      galerieName: "🎨 Galerie Test 3D",
      titre: "🌅 Lumière d'Automne",
      description: "Une exploration de la lumière automnale à travers des touches impressionnistes délicates.",
      prix: 450,
      dateRealisation: "2024-09-15",
      technique: "Huile sur toile",
      dimensions: "80 × 60 cm",
      statut: "Publié",
      nbExemplaires: 1,
      tags: ["Impressionnisme", "Automne"],
      img: "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?w=400&h=300&fit=crop",
    },
    {
      id: "test_oeuvre_2",
      galerieId: "test_galerie_fixed",
      galerieName: "🎨 Galerie Test 3D",
      titre: "💙 Reflets Bleutés",
      description: "Jeu de reflets sur l'eau au coucher du soleil, inspiré des étangs normands.",
      prix: 280,
      dateRealisation: "2024-07-20",
      technique: "Aquarelle",
      dimensions: "50 × 40 cm",
      statut: "Publié",
      nbExemplaires: 3,
      tags: ["Aquarelle", "Eau"],
      img: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=300&fit=crop",
    },
    {
      id: "test_oeuvre_3",
      galerieId: "test_galerie_fixed",
      galerieName: "🎨 Galerie Test 3D",
      titre: "✨ Portail Doré",
      description: "La magnificence dorée d'une entrée parisienne, capturée dans ses moindres détails.",
      prix: 720,
      dateRealisation: "2024-11-03",
      technique: "Peinture acrylique",
      dimensions: "100 × 80 cm",
      statut: "Publié",
      nbExemplaires: 1,
      tags: ["Paris", "Architecture", "Or"],
      img: "https://images.unsplash.com/photo-1582552938358-32d906df40cb?w=400&h=300&fit=crop",
    },
    {
      id: "test_oeuvre_4",
      galerieId: "test_galerie_fixed",
      galerieName: "🎨 Galerie Test 3D",
      titre: "🌸 Jardin Secret",
      description: "Un jardin fleuri aux couleurs printanières, capturé dans un style impressionniste lumineux.",
      prix: 390,
      dateRealisation: "2024-05-10",
      technique: "Huile sur toile",
      dimensions: "70 × 50 cm",
      statut: "Publié",
      nbExemplaires: 2,
      tags: ["Jardin", "Printemps", "Fleurs"],
      img: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop",
    },
    {
      id: "test_oeuvre_5",
      galerieId: "test_galerie_fixed",
      galerieName: "🎨 Galerie Test 3D",
      titre: "🌊 Soirée d'Été",
      description: "Une soirée d'été en bord de mer, avec des couleurs chaudes et une ambiance paisible.",
      prix: 560,
      dateRealisation: "2024-08-22",
      technique: "Pastel",
      dimensions: "60 × 45 cm",
      statut: "Publié",
      nbExemplaires: 1,
      tags: ["Été", "Mer", "Coucher de soleil"],
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
    },
  ];
  
  // Réinitialiser et créer les données de test
  const resetAndCreateTestData = () => {
    console.log("🔧 Réinitialisation des données de test...");
    
    // Supprimer l'ancienne galerie de test si elle existe
    const existingGalerie = chambres.find(c => c.id === "test_galerie_fixed");
    if (existingGalerie) {
      supprimerChambre("test_galerie_fixed");
    }
    
    // Créer la nouvelle galerie
    ajouterChambre({ ...TEST_GALERIE });
    
    // Créer les œuvres
    setTimeout(() => {
      TEST_OEUVRES.forEach(oeuvre => {
        ajouterOeuvre({ ...oeuvre });
      });
      console.log("✅ Données de test créées avec succès !");
      setTestGalerieId("test_galerie_fixed");
      setNbOeuvres(TEST_OEUVRES.length);
      setIsReady(true);
    }, 100);
  };
  
  // Initialisation
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    
    // Vérifier si la galerie existe déjà
    const existingGalerie = chambres.find(c => c.id === "test_galerie_fixed");
    
    if (existingGalerie) {
      // Compter les œuvres existantes
      const existingOeuvres = oeuvres.filter(o => o.galerieId === "test_galerie_fixed" && o.statut === "Publié");
      setTestGalerieId("test_galerie_fixed");
      setNbOeuvres(existingOeuvres.length);
      setIsReady(true);
      console.log(`📦 Données existantes: ${existingOeuvres.length} œuvres`);
    } else {
      // Créer les données
      resetAndCreateTestData();
    }
  }, [chambres.length, oeuvres.length]);
  
  // Si pas prêt
  if (!isReady) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        flexDirection: "column",
        gap: 20,
        background: "#1a1a1a",
        color: "white"
      }}>
        <div style={{ fontSize: 48 }}>🎨</div>
        <h2>Préparation de la galerie de test...</h2>
        <div style={{ fontSize: 14, color: "#C9A040" }}>
          ⏳ Création des données...
        </div>
        <div style={{ width: 200, height: 4, background: "#333", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ 
            width: "60%", 
            height: "100%", 
            background: "#C9A040", 
            borderRadius: 2,
            animation: "loading 1s ease-in-out infinite"
          }} />
        </div>
        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>
    );
  }
  
  return (
    <div style={{ 
      padding: "40px 20px", 
      textAlign: "center", 
      background: "linear-gradient(135deg, #1a1a1a, #2a0a0a)",
      minHeight: "100vh",
      color: "white"
    }}>
      <div style={{ marginBottom: 40 }}>
        <span style={{ fontSize: 64 }}>🎨</span>
        <h1 style={{ fontSize: 32, margin: "10px 0", color: "#C9A040" }}>Test de la Galerie 3D</h1>
        <p style={{ color: "#ccc" }}>Découvrez comment les œuvres sont disposées sur les murs</p>
      </div>
      
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        gap: 40,
        flexWrap: "wrap",
        marginBottom: 40
      }}>
        <div style={{ 
          background: "rgba(255,255,255,0.1)", 
          padding: "20px 30px", 
          borderRadius: 12
        }}>
          <div style={{ fontSize: 28, fontWeight: "bold", color: "#C9A040" }}>{nbOeuvres}</div>
          <div>Œuvres exposées</div>
        </div>
        <div style={{ 
          background: "rgba(255,255,255,0.1)", 
          padding: "20px 30px", 
          borderRadius: 12
        }}>
          <div style={{ fontSize: 28, fontWeight: "bold", color: "#C9A040" }}>24 × 18 m</div>
          <div>Dimensions</div>
        </div>
        <div style={{ 
          background: "rgba(255,255,255,0.1)", 
          padding: "20px 30px", 
          borderRadius: 12
        }}>
          <div style={{ fontSize: 28, fontWeight: "bold", color: "#C9A040" }}>Classique</div>
          <div>Décor</div>
        </div>
      </div>
      
      <div style={{ marginBottom: 30 }}>
        <h3>📋 Œuvres disponibles :</h3>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 15, marginTop: 15 }}>
          {TEST_OEUVRES.map(oeuvre => (
            <div key={oeuvre.id} style={{ 
              background: "rgba(0,0,0,0.5)", 
              padding: "8px 15px", 
              borderRadius: 20,
              fontSize: 14
            }}>
              🖼️ {oeuvre.titre} - {oeuvre.prix} DT
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
        <button 
          onClick={() => navigate(`/galerie-3d/test_galerie_fixed`, { state: { mode: "visiteur" } })}
          style={{
            padding: "15px 40px",
            fontSize: 18,
            background: "linear-gradient(135deg, #8B2020, #5C0E0E)",
            color: "white",
            border: "none",
            borderRadius: 40,
            cursor: "pointer",
            transition: "transform 0.2s"
          }}
          onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"}
        >
          🖼️ Voir la galerie en 3D
        </button>
        
        <button 
          onClick={() => {
            resetAndCreateTestData();
            window.location.reload();
          }}
          style={{
            padding: "15px 30px",
            fontSize: 16,
            background: "rgba(255,255,255,0.1)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 40,
            cursor: "pointer"
          }}
        >
          🔄 Réinitialiser les données
        </button>
      </div>
      
      <div style={{ marginTop: 40, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
        <p>💡 Astuce: Les œuvres sont automatiquement disposées sur les 4 murs</p>
        <p>🖱️ Utilise la souris pour te déplacer et zoomer</p>
        <p>✨ {nbOeuvres} œuvres seront visibles sur les murs Nord, Sud, Est et Ouest</p>
      </div>
    </div>
  );
}