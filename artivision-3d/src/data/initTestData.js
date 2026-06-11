// src/data/initTestData.js
import { useArtisteStore } from "../store/useArtisteStore";

export const TEST_GALERIE = {
  id: "test_galerie_1",
  nom: "Galerie Test - Impressionnisme",
  description: "Une magnifique galerie d'art impressionniste avec des œuvres déjà exposées",
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

export const TEST_OEUVRES = [
  {
    id: "test_oeuvre_1",
    galerieId: "test_galerie_1",
    galerieName: "Galerie Test - Impressionnisme",
    titre: "Lumière d'Automne",
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
    galerieId: "test_galerie_1",
    galerieName: "Galerie Test - Impressionnisme",
    titre: "Reflets Bleutés",
    description: "Jeu de reflets sur l'eau au coucher du soleil.",
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
    galerieId: "test_galerie_1",
    galerieName: "Galerie Test - Impressionnisme",
    titre: "Portail Doré",
    description: "La magnificence dorée d'une entrée parisienne.",
    prix: 720,
    dateRealisation: "2024-11-03",
    technique: "Peinture acrylique",
    dimensions: "100 × 80 cm",
    statut: "Publié",
    nbExemplaires: 1,
    tags: ["Paris", "Architecture"],
    img: "https://images.unsplash.com/photo-1582552938358-32d906df40cb?w=400&h=300&fit=crop",
  },
  {
    id: "test_oeuvre_4",
    galerieId: "test_galerie_1",
    galerieName: "Galerie Test - Impressionnisme",
    titre: "Jardin Secret",
    description: "Un jardin fleuri aux couleurs printanières.",
    prix: 390,
    dateRealisation: "2024-05-10",
    technique: "Huile sur toile",
    dimensions: "70 × 50 cm",
    statut: "Publié",
    nbExemplaires: 2,
    tags: ["Jardin", "Printemps"],
    img: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop",
  },
  {
    id: "test_oeuvre_5",
    galerieId: "test_galerie_1",
    galerieName: "Galerie Test - Impressionnisme",
    titre: "Soirée d'Été",
    description: "Une soirée d'été en bord de mer.",
    prix: 560,
    dateRealisation: "2024-08-22",
    technique: "Pastel",
    dimensions: "60 × 45 cm",
    statut: "Publié",
    nbExemplaires: 1,
    tags: ["Été", "Mer"],
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
  },
  {
    id: "test_oeuvre_6",
    galerieId: "test_galerie_1",
    galerieName: "Galerie Test - Impressionnisme",
    titre: "Matinée d'Hiver",
    description: "La brume matinale d'un hiver doux.",
    prix: 320,
    dateRealisation: "2024-12-05",
    technique: "Aquarelle",
    dimensions: "45 × 35 cm",
    statut: "Publié",
    nbExemplaires: 2,
    tags: ["Hiver", "Brumatique"],
    img: "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?w=400&h=300&fit=crop",
  },
];

export const initTestData = () => {
  console.log("🎨 Initialisation des données de test...");
  
  const store = useArtisteStore.getState();
  
  // Vérifier si la galerie existe déjà
  const existingGalerie = store.chambres.find(c => c.id === "test_galerie_1");
  
  if (!existingGalerie) {
    // Ajouter la galerie
    store.ajouterChambre({ ...TEST_GALERIE });
    
    // Ajouter les œuvres
    TEST_OEUVRES.forEach(oeuvre => {
      store.ajouterOeuvre({ ...oeuvre });
    });
    
    console.log(`✅ Données ajoutées : 1 galerie, ${TEST_OEUVRES.length} œuvres`);
    return true;
  } else {
    console.log("📦 Données déjà existantes");
    return false;
  }
};

// Fonction pour forcer la réinitialisation
export const forceResetTestData = () => {
  const store = useArtisteStore.getState();
  
  // Supprimer la galerie de test
  const testGalerie = store.chambres.find(c => c.id === "test_galerie_1");
  if (testGalerie) {
    store.supprimerChambre("test_galerie_1");
  }
  
  // Réinitialiser
  return initTestData();
};