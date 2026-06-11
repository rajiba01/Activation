// src/store/useArtisteStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEMO_CHAMBRES = [
  {
    id: "demo_gallery_1",
    nom: "Galerie Impressionniste - Démo",
    decor: "classique",
    description: "Une galerie de démonstration",
  },
];

const DEMO_OEUVRES = [
  {
    id: "demo_oeuvre_1",
    galerieId: "demo_gallery_1",
    titre: "Lumière d'Automne",
    description: "Une exploration de la lumière automnale.",
    prix: 450,
    technique: "Huile sur toile",
    dimensions: "60x80cm",
    statut: "Publié",
    img: "https://picsum.photos/seed/autumn/600/400",
    display_width: 1.2,
    display_height: 0.9,
  },
  {
    id: "demo_oeuvre_2",
    galerieId: "demo_gallery_1",
    titre: "Soirée d'Été",
    description: "Les couleurs chaudes d'une soirée estivale.",
    prix: 580,
    technique: "Acrylique",
    dimensions: "50x70cm",
    statut: "Publié",
    img: "https://picsum.photos/seed/summer/600/400",
    display_width: 1.2,
    display_height: 0.9,
  },
  {
    id: "demo_oeuvre_3",
    galerieId: "demo_gallery_1",
    titre: "Portail Doré",
    description: "Un portail mystérieux baigné de lumière dorée.",
    prix: 720,
    technique: "Huile sur toile",
    dimensions: "70x90cm",
    statut: "Publié",
    img: "https://picsum.photos/seed/portal/600/400",
    display_width: 1.2,
    display_height: 0.9,
  },
  {
    id: "demo_oeuvre_4",
    galerieId: "demo_gallery_1",
    titre: "Forêt Bleue",
    description: "Une forêt enveloppée dans une brume bleue.",
    prix: 390,
    technique: "Aquarelle",
    dimensions: "40x60cm",
    statut: "Publié",
    img: "https://picsum.photos/seed/forest/600/400",
    display_width: 1.2,
    display_height: 0.9,
  },
  {
    id: "demo_oeuvre_5",
    galerieId: "demo_gallery_1",
    titre: "Mer Calme",
    description: "La sérénité d'une mer apaisée.",
    prix: 510,
    technique: "Huile sur toile",
    dimensions: "80x60cm",
    statut: "Publié",
    img: "https://picsum.photos/seed/ocean/600/400",
    display_width: 1.2,
    display_height: 0.9,
  },
  {
    id: "demo_oeuvre_6",
    galerieId: "demo_gallery_1",
    titre: "Montagne Rose",
    description: "Un sommet enneigé teinté de rose au coucher du soleil.",
    prix: 650,
    technique: "Pastel",
    dimensions: "60x80cm",
    statut: "Publié",
    img: "https://picsum.photos/seed/mountain/600/400",
    display_width: 1.2,
    display_height: 0.9,
  },
  {
    id: "demo_oeuvre_7",
    galerieId: "demo_gallery_1",
    titre: "Jardin Secret",
    description: "Un jardin caché plein de mystère.",
    prix: 430,
    technique: "Acrylique",
    dimensions: "50x50cm",
    statut: "Publié",
    img: "https://picsum.photos/seed/garden/600/400",
    display_width: 1.0,
    display_height: 1.0,
  },
  {
    id: "demo_oeuvre_8",
    galerieId: "demo_gallery_1",
    titre: "Ciel de Minuit",
    description: "Un ciel étoilé d'une beauté envoûtante.",
    prix: 780,
    technique: "Huile sur toile",
    dimensions: "90x60cm",
    statut: "Publié",
    img: "https://picsum.photos/seed/midnight/600/400",
    display_width: 1.4,
    display_height: 0.9,
  },
];

export const useArtisteStore = create(
  persist(
    (set, get) => ({
      artiste: {
        id: "artiste_demo",
        nom: "Ariana Soghra",
        email: "ariana@artivision.com",
      },

      // ✅ Données de démo par défaut
      chambres: DEMO_CHAMBRES,
      oeuvres: DEMO_OEUVRES,

      // ========== ACTIONS CHAMBRES ==========
      ajouterChambre: (chambre) =>
        set((state) => ({
          chambres: [...state.chambres, { ...chambre, id: Date.now().toString() }],
        })),

      modifierChambre: (id, updates) =>
        set((state) => ({
          chambres: state.chambres.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      supprimerChambre: (id) =>
        set((state) => ({
          chambres: state.chambres.filter((c) => c.id !== id),
          oeuvres: state.oeuvres.filter((o) => o.galerieId !== id),
        })),

      // ========== ACTIONS ŒUVRES ==========
      ajouterOeuvre: (oeuvre) =>
        set((state) => ({
          oeuvres: [...state.oeuvres, { ...oeuvre, id: Date.now().toString() }],
        })),

      modifierOeuvre: (id, updates) =>
        set((state) => ({
          oeuvres: state.oeuvres.map((o) =>
            o.id === id ? { ...o, ...updates } : o
          ),
        })),

      supprimerOeuvre: (id) =>
        set((state) => ({
          oeuvres: state.oeuvres.filter((o) => o.id !== id),
        })),

      // ========== IMPORT DONNÉES BACKEND ==========
      importArtisteData: (data) => {
        set({
          artiste: data.artiste || get().artiste,
          chambres: data.chambres || [],
          oeuvres: data.oeuvres || [],
        });
      },

      // ========== UTILITAIRES ==========
      // ✅ Suppression du filtre statut pour la démo, ou rendre flexible
      getOeuvresByChambre: (chambreId) => {
        const oeuvres = get().oeuvres.filter((o) => o.galerieId === chambreId);
        console.log(`🔍 getOeuvresByChambre(${chambreId}):`, oeuvres.length, "œuvres trouvées");
        return oeuvres.filter((o) => !o.statut || o.statut === "Publié");
      },

      getChambreById: (id) => {
        return get().chambres.find((c) => c.id === id);
      },

      reset: () => set({ chambres: DEMO_CHAMBRES, oeuvres: DEMO_OEUVRES, artiste: null }),
    }),
    {
      name: "artivision-storage",
    }
  )
);