// src/services/index.js
export { authService } from './auth.service';
export { galerieService } from './galerie.service';
export { oeuvreService } from './oeuvre.service';
export { commandeService } from './commande.service';
export { gallerySyncService } from './gallerySync.service';
export { purchaseService } from './purchase.service';  // ← AJOUTER CETTE LIGNE
export { default as api } from './api';