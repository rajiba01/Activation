import { create } from "zustand";
import { galerieService, oeuvreService } from "../services";

export const useArtisteStore = create((set, get) => ({
  // État
  chambres: [],
  oeuvres: [],
  loading: false,
  error: null,

  // ========== CHAMBRES (GALERIES) ==========
  loadChambres: async () => {
    set({ loading: true, error: null });
    try {
      const response = await galerieService.getAll();
      console.log("📦 Galeries chargées:", response.data);
      // Afficher le subscription_type de chaque galerie pour déboguer
      response.data.forEach(g => {
        console.log(`  - ${g.nom}: subscription_type = ${g.subscription_type || 'non défini'}`);
      });
      set({ chambres: response.data, loading: false });
      return response.data;
    } catch (error) {
      console.error("❌ loadChambres:", error);
      set({ error: error.message, loading: false });
      return [];
    }
  },

  ajouterChambre: async (chambreData) => {
    set({ loading: true, error: null });
    try {
      // 🔧 IMPORTANT: Inclure subscription_type dans l'appel API
      console.log("📤 Création galerie avec données:", {
        nom: chambreData.nom,
        subscription_type: chambreData.subscription_type,
      });
      
      const response = await galerieService.create(chambreData);
      const newChambre = response.data;
      console.log("✅ Galerie créée, subscription_type reçu:", newChambre.subscription_type);
      
      set((state) => ({ 
        chambres: [...state.chambres, newChambre],
        loading: false 
      }));
      return newChambre;
    } catch (error) {
      console.error("❌ ajouterChambre:", error.response?.data || error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  modifierChambre: async (id, updates) => {
    try {
      const response = await galerieService.update(id, updates);
      set((state) => ({
        chambres: state.chambres.map((c) => 
          c.id === id ? { ...c, ...response.data } : c
        ),
      }));
      return response.data;
    } catch (error) {
      console.error("❌ modifierChambre:", error);
      throw error;
    }
  },

  supprimerChambre: async (id) => {
    try {
      await galerieService.delete(id);
      set((state) => ({
        chambres: state.chambres.filter((c) => c.id !== id),
        oeuvres: state.oeuvres.filter((o) => o.galerie !== id),
      }));
      console.log("✅ Galerie supprimée:", id);
    } catch (error) {
      console.error("❌ supprimerChambre:", error);
      throw error;
    }
  },

  // ========== OEUVRES ==========
  loadOeuvres: async () => {
    set({ loading: true, error: null });
    try {
      const response = await oeuvreService.getAll();
      console.log("📦 Œuvres chargées:", response.data.length);
      // Afficher la galerie associée à chaque œuvre
      response.data.forEach(o => {
        console.log(`  - "${o.titre}": galerie_id = ${o.galerie || o.galerie_id || 'non associé'}`);
      });
      set({ oeuvres: response.data, loading: false });
      return response.data;
    } catch (error) {
      console.error("❌ loadOeuvres:", error);
      set({ error: error.message, loading: false });
      return [];
    }
  },

  ajouterOeuvre: async (oeuvreData) => {
    set({ loading: true, error: null });
    try {
      // 🔧 Vérifier que l'œuvre est associée à une galerie
      console.log("📤 Création œuvre avec galerie:", oeuvreData.galerie || oeuvreData.galerie_id);
      
      const response = await oeuvreService.create(oeuvreData);
      const newOeuvre = response.data;
      set((state) => ({ 
        oeuvres: [...state.oeuvres, newOeuvre],
        loading: false 
      }));
      console.log("✅ Œuvre créée:", newOeuvre.titre);
      return newOeuvre;
    } catch (error) {
      console.error("❌ ajouterOeuvre:", error.response?.data || error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  modifierOeuvre: async (id, updates) => {
    try {
      const response = await oeuvreService.update(id, updates);
      set((state) => ({
        oeuvres: state.oeuvres.map((o) => 
          o.id === id ? { ...o, ...response.data } : o
        ),
      }));
      return response.data;
    } catch (error) {
      console.error("❌ modifierOeuvre:", error);
      throw error;
    }
  },

  supprimerOeuvre: async (id) => {
    try {
      await oeuvreService.delete(id);
      set((state) => ({
        oeuvres: state.oeuvres.filter((o) => o.id !== id),
      }));
      console.log("✅ Œuvre supprimée:", id);
    } catch (error) {
      console.error("❌ supprimerOeuvre:", error);
      throw error;
    }
  },

  // ========== UTILITAIRES ==========
  getOeuvresByChambre: (chambreId) => {
    // 🔧 Filtrer correctement par galerie_id
    const targetId = parseInt(chambreId);
    const filtered = get().oeuvres.filter((o) => {
      const oeuvreGalerieId = parseInt(o.galerie || o.galerie_id || o.chambre_id);
      return oeuvreGalerieId === targetId;
    });
    console.log(`🔍 getOeuvresByChambre(${chambreId}) -> ${filtered.length} œuvres`);
    return filtered;
  },

  getChambreById: (id) => {
    return get().chambres.find((c) => c.id === id);
  },

  reset: () => set({ chambres: [], oeuvres: [], loading: false, error: null }),
}));