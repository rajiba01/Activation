// src/store/useGalleryStore.js
import { create } from 'zustand';

export const useGalleryStore = create((set) => ({
  // État de navigation
  navMode: 'auto', // 'auto' ou 'manual'
  isPlaying: true,
  
  // État de l'avatar
  avatarPosition: { x: -5, z: 3, y: 0 },
  avatarTargetPoint: 0,
  avatarWalking: false,
  
  // État du guide
  guideActive: false,
  guideMessage: null,
  guideArtwork: null,
  
  // UI
  panelOpen: true,
  showMinimap: true,
  showInstructions: true,
  
  // Actions
  setNavMode: (mode) => set({ navMode: mode }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  
  setAvatarPosition: (position) => set({ avatarPosition: position }),
  setAvatarTargetPoint: (index) => set({ avatarTargetPoint: index }),
  setAvatarWalking: (walking) => set({ avatarWalking: walking }),
  
  setGuideMessage: (message, artwork = null) => set({ 
    guideMessage: message, 
    guideArtwork: artwork,
    guideActive: !!message 
  }),
  clearGuideMessage: () => set({ 
    guideMessage: null, 
    guideArtwork: null,
    guideActive: false 
  }),
  
  setPanelOpen: (open) => set({ panelOpen: open }),
  togglePanel: () => set((state) => ({ panelOpen: !state.panelOpen })),
  
  setShowMinimap: (show) => set({ showMinimap: show }),
  setShowInstructions: (show) => set({ showInstructions: show }),
}));