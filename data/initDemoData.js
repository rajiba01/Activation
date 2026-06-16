// src/data/initDemoData.js
import { useArtisteStore } from "../store/useArtisteStore";

// URLs d'images qui fonctionnent (CORS friendly)
const IMAGES = {
  oeuvre1: "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
  oeuvre2: "https://threejs.org/examples/textures/planets/moon_1024.jpg",
  oeuvre3: "https://threejs.org/examples/textures/planets/venus_surface.jpg",
  oeuvre4: "https://threejs.org/examples/textures/planets/mars.jpg",
  oeuvre5: "https://threejs.org/examples/textures/uv_grid_opengl.jpg",
  oeuvre6: "https://threejs.org/examples/textures/uv_grid_opengl.jpg",
};

// Données de démonstration pour la galerie
const DEMO_CHAMBRE = {
  id: "demo_gallery_1",
  nom: "Galerie Impressionniste - Démo",
  description: "Une magnifique galerie virtuelle pour découvrir l'impressionnisme.",
  localisation: "Paris, France",
  surface: "16 × 10 m",
  decor: "classique",
  prixEntree: 5,
  dureeAcces: "48h",
  nbOeuvresMax: 10,
  tarifMensuel: 69,
  dateCreation: new Date().toISOString().split("T")[0],
  nbVisiteursTotal: 1240,
  revenus: 6200,
  width: 16,
  depth: 10,
  wallColor: "#F5ECD7",
  headerVariant: "burg",
};

// Données de démonstration pour les œuvres
const DEMO_OEUVRES = [
  {
    id: "demo_oeuvre_1",
    galerieId: "demo_gallery_1",
    titre: "Lumière d'Automne",
    description: "Une exploration de la lumière automnale à travers des touches impressionnistes délicates.",
    prix: 450,
    dateRealisation: "2024-09-15",
    technique: "Huile sur toile",
    dimensions: "80 × 60 cm",
    statut: "Publié",
    nbExemplaires: 1,
    tags: ["Impressionnisme", "Automne", "Lumière"],
    img: IMAGES.oeuvre1,
  },
  {
    id: "demo_oeuvre_2",
    galerieId: "demo_gallery_1",
    titre: "Reflets Bleutés",
    description: "Jeu de reflets sur l'eau au coucher du soleil.",
    prix: 280,
    dateRealisation: "2024-07-20",
    technique: "Aquarelle",
    dimensions: "50 × 40 cm",
    statut: "Publié",
    nbExemplaires: 3,
    tags: ["Aquarelle", "Eau", "Coucher de soleil"],
    img: IMAGES.oeuvre2,
  },
  {
    id: "demo_oeuvre_3",
    galerieId: "demo_gallery_1",
    titre: "Portail Doré",
    description: "La magnificence dorée d'une entrée parisienne.",
    prix: 720,
    dateRealisation: "2024-11-03",
    technique: "Peinture acrylique",
    dimensions: "100 × 80 cm",
    statut: "Publié",
    nbExemplaires: 1,
    tags: ["Paris", "Architecture", "Or"],
    img: IMAGES.oeuvre3,
  },
  {
    id: "demo_oeuvre_4",
    galerieId: "demo_gallery_1",
    titre: "Nuit Parisienne",
    description: "Une nuit parisienne abstraite, entre rêve et réalité.",
    prix: 190,
    dateRealisation: "2024-05-12",
    technique: "Pastel",
    dimensions: "40 × 30 cm",
    statut: "Brouillon",
    nbExemplaires: 5,
    tags: ["Nuit", "Abstrait", "Paris"],
    img: IMAGES.oeuvre4,
  },
  {
    id: "demo_oeuvre_5",
    galerieId: "demo_gallery_1",
    titre: "Aube Rosée",
    description: "Les premières lueurs rosées de l'aube sur les toits de la ville.",
    prix: 340,
    dateRealisation: "2024-08-28",
    technique: "Huile sur toile",
    dimensions: "70 × 55 cm",
    statut: "Publié",
    nbExemplaires: 1,
    tags: ["Aube", "Lumière", "Toits"],
    img: IMAGES.oeuvre5,
  },
  {
    id: "demo_oeuvre_6",
    galerieId: "demo_gallery_1",
    titre: "Horizon Violet",
    description: "Le violet profond de l'horizon au crépuscule.",
    prix: 560,
    dateRealisation: "2025-01-10",
    technique: "Huile sur toile",
    dimensions: "90 × 70 cm",
    statut: "Publié",
    nbExemplaires: 1,
    tags: ["Horizon", "Crépuscule", "Violet"],
    img: IMAGES.oeuvre6,
  },
];

export const initDemoData = () => {
  const chambres = useArtisteStore.getState().chambres;
  const oeuvres = useArtisteStore.getState().oeuvres;
  
  const demoExists = chambres.some(c => c.id === "demo_gallery_1");
  
  if (!demoExists) {
    console.log("📦 Initialisation des données de démonstration...");
    useArtisteStore.getState().ajouterChambre(DEMO_CHAMBRE);
    
    DEMO_OEUVRES.forEach(oeuvre => {
      const exists = oeuvres.some(o => o.id === oeuvre.id);
      if (!exists) {
        useArtisteStore.getState().ajouterOeuvre(oeuvre);
      }
    });
    
    console.log("✅ Données de démonstration initialisées avec images Three.js (CORS OK)");
  }
};

export { DEMO_CHAMBRE, DEMO_OEUVRES };