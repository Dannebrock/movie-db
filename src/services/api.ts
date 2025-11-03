import axios from "axios";

const api = axios.create({
baseURL: import.meta.env.VITE_API_BASE_URL,
headers: {
accept: "application/json",
Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
},
});

export const getPopularMovies = async (page: number) => { // <--- 1. Recebe 'page' como argumento
        const response = await api.get('/movie/popular', {
        params: {
        language: 'pt-BR',
        page: page, 
        }
    });

      return response.data; 
};

export const getDetailMovies = async (id: number) => {   
  const response = await api.get(`/movie/${id}`, {
    params: {
    language: 'pt-BR',       
    }
  });

  return response.data; // Retorna o objeto completo do filme
};

export const searchMovies = async (page: number, termo: string) => {  
  const response = await api.get(`search/movie?query=${termo}`, {
    params: {
    language: 'pt-BR',
    page: page,    
    }
  });

  return response.data; 
};

export default api;