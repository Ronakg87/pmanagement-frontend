import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const login = async (credentials) => {
  const res = await axios.post(`${API_URL}/login`, credentials);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};
