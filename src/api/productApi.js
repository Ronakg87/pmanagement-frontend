import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const fetchProducts = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/all-products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
