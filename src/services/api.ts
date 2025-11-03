import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
  },
});

// 🔹 Função específica para filmes populares
export const getPopularMovies = async () => {
  const response = await api.get("/movie/popular?language=pt-BR&page=1");
  return response.data.results;
};

export default api;
