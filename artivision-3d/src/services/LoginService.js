const BASE_URL = "http://127.0.0.1:8000/api";

export const authService = {
  login: async (credentials) => {
    const response = await fetch(`${BASE_URL}/accounts/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  registerUser: async (userData) => {
    const response = await fetch(`${BASE_URL}/accounts/register/user/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
};