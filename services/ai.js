// src/services/chatIA.service.js
import axios from "axios";

const API_BASE = "http://localhost:8000/api/ia";

export const chatIAService = {
  /**
   * Envoie un message au chatbot IA
   * @param {string} message - Le message de l'utilisateur
   * @param {Object} context - Les données contextuelles (galerieId, oeuvres, etc.)
   */
  sendMessage: async (message, context = {}) => {
    try {
      // Ajuste l'endpoint exact selon ton routage Django (ex: /chat/ ou directement /)
      const response = await axios.post(`${API_BASE}`, {
        message,
        context
      });
      return response.data; // Attend un format ex: { response: "Bonjour..." }
    } catch (error) {
      console.error("❌ Erreur de communication avec l'agent IA:", error);
      throw error;
    }
  }
};