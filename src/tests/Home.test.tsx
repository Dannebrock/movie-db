import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Home from '../pages/Home'; 
import '@testing-library/jest-dom';


import { getPopularMovies } from '../services/api';
    vi.mock('../services/api');
    const mockedGetPopularMovies = vi.mocked(getPopularMovies);

    vi.mock('../components/MovieCard', () => ({
    default: (props: any) => (  
      <div data-testid="movie-card">{props.movie.title}</div>
    )
    }));

  let capturedNextFunction: () => void = () => {}; 
  vi.mock('react-infinite-scroll-component', () => ({
  default: (props: any) => {  
    capturedNextFunction = props.next;  
    return (
    <div data-testid="mock-infinite-scroll">    
      {props.children}        
      {props.hasMore && props.loader}
      {!props.hasMore && props.endMessage}
    </div>
    );
  }
  }));

  const MOCK_PAGE_1 = {
  page: 1,
  total_pages: 2,
  results: [
    { id: 1, title: 'Filme 1', poster_path: '/img1.jpg', vote_average: 8 },
    { id: 2, title: 'Filme 2', poster_path: '/img2.jpg', vote_average: 7 },
  ]
  };

  const MOCK_PAGE_2 = {
  page: 2,
  total_pages: 2, 
  results: [
    { id: 3, title: 'Filme 3', poster_path: '/img3.jpg', vote_average: 9 },
  ]
  };

describe('Página Home', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    capturedNextFunction = () => {}; 
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  
  it('deve mostrar o spinner de carregamento inicial', async () => {    
    mockedGetPopularMovies.mockReturnValue(new Promise(() => {}));
    render(<Home />);    
    expect(screen.getByText('Carregando...')).toBeInTheDocument();    
    
    expect(screen.queryByTestId('movie-card')).not.toBeInTheDocument();
    expect(screen.queryByText('Tente novamente mais tarde...')).not.toBeInTheDocument();
  });
  
    it('deve mostrar a mensagem "Tente novamente" se a API falhar na carga inicial', async () => {
      mockedGetPopularMovies.mockRejectedValue(new Error('API Fora do Ar'));
      
    render(<Home />); 

    expect(await screen.findByText('Tente novamente mais tarde...')).toBeInTheDocument();  
    expect(mockedGetPopularMovies).toHaveBeenCalledWith(1);  
    expect(screen.queryByTestId('movie-card')).not.toBeInTheDocument();
  });

 it('deve renderizar os filmes da página 1 e o loader de "carregar mais"', async () => {  
  mockedGetPopularMovies.mockResolvedValue(MOCK_PAGE_1);
  
  render(<Home />);  
  
  expect(await screen.findByText('Filme 1')).toBeInTheDocument();  
  expect(screen.getByText('Filme 2')).toBeInTheDocument();
  expect(screen.getAllByTestId('movie-card')).toHaveLength(2);  
  expect(mockedGetPopularMovies).toHaveBeenCalledWith(1);    
  
  expect(screen.queryByText(/Você já viu tudo!/i)).not.toBeInTheDocument();
 });

 it('deve buscar e adicionar mais filmes ao simular "scroll"', async () => {
  mockedGetPopularMovies.mockResolvedValueOnce(MOCK_PAGE_1);
  render(<Home />);  
  expect(await screen.findByText('Filme 1')).toBeInTheDocument();
  expect(screen.getAllByTestId('movie-card')).toHaveLength(2);  
  
  mockedGetPopularMovies.mockResolvedValueOnce(MOCK_PAGE_2);

  await act(async () => {
   capturedNextFunction();
  });
  
  expect(await screen.findByText('Filme 3')).toBeInTheDocument();  
  expect(mockedGetPopularMovies).toHaveBeenCalledTimes(2);
  expect(mockedGetPopularMovies).toHaveBeenCalledWith(2);  
  expect(screen.getAllByTestId('movie-card')).toHaveLength(3);  
  expect(screen.getByText('Filme 1')).toBeInTheDocument();
 });

 it('deve mostrar a mensagem "fim" quando todas as páginas forem carregadas', async () => {
  mockedGetPopularMovies.mockResolvedValueOnce(MOCK_PAGE_1);
  render(<Home />);
  expect(await screen.findByText('Filme 1')).toBeInTheDocument();
  
  mockedGetPopularMovies.mockResolvedValueOnce(MOCK_PAGE_2);
  
  await act(async () => {
   capturedNextFunction();
  });    
  expect(await screen.findByText('Filme 3')).toBeInTheDocument();    
  expect(screen.getByText(/Você já viu tudo!/i)).toBeInTheDocument();
  expect(screen.queryByText('Carregando mais...')).not.toBeInTheDocument();
 });
});