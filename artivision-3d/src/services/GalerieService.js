const BASE_URL = "http://127.0.0.1:8000/api";

export const galerieService = {
  createGalerie: async (galerieData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/galerie/galeries/`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(galerieData),
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  createOeuvreMultipart: async (formData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/galerie/oeuvres/`, {
      method: "POST",
      headers: {
        // NE PAS DÉFINIR DE 'Content-Type' ICI (Fetch le fait automatiquement pour le multipart/form-data)
        "Authorization": `Bearer ${token}`
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
};