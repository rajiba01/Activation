import { create } from "zustand";

export const useGalleryStore = create((set) => ({
  // Position et direction caméra
  cameraPosition: [0, 1.7, 8],
  cameraTarget: [0, 1.7, 0],

  // Mode navigation
  navMode: "auto", // "auto" | "manual"
  isPlaying: true,

  // Salle active
  activeRoom: 1, // 1 | 2 | 3

  // Œuvre sélectionnée (clic)
  selectedArtwork: null,

  // Œuvres chargées depuis l'API
  artworks: [],

  // Actions
  setNavMode: (mode) => set({ navMode: mode }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setCameraPosition: (pos) => set({ cameraPosition: pos }),
  setCameraTarget: (tgt) => set({ cameraTarget: tgt }),
  setSelectedArtwork: (artwork) => set({ selectedArtwork: artwork }),
  clearSelectedArtwork: () => set({ selectedArtwork: null }),
  setArtworks: (artworks) => set({ artworks }),
  setActiveRoom: (room) => set({ activeRoom: room }),
}));