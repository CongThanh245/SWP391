import api from "../api/axiosInstance";

export const login = async (email, password) => {
  const response = await api.post("/auth/authenticate", {
    email,
    password,
  });

  const token = response.data.token;
  if (token) {
    localStorage.setItem("token", token); // save token
  }

  return token;
};