// src/pages/Search/Search.test.tsx

import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLocation } from 'react-router-dom';
import Search from '../pages/Search';
import { searchMovies } from '../services/api';
import '@testing-library/jest-dom';


vi.mock('react-router-dom', async (importOriginal) => {
 const actual = await importOriginal();
 return {
  ...(actual as object), 
  useLocation: vi.fn(),
 };
});
const mockedUseLocation = vi.mocked(useLocation);

vi.mock('../services/api');
const mockedSearchMovies = vi.mocked(searchMovies);

vi.mock('../components/MovieCard', () => ({
  default: (props: any) => (
    <div data-testid="movie-card" data-highlight={props.highlightQuery}>
      {props.movie.title}
    </div>
  )
}));

let capturedNextFunction: () => void = () => {};
vi.mock('react-infinite-scroll-component', () => ({
  default: (props: any) => {
    capturedNextFunction = props.next;
    return (
      <div data-testid="mock-infinite-scroll">
        {props.children}
        {props.hasMore && <div>{props.loader.props.children}</div>}
        {!props.hasMore && <div>{props.endMessage.props.children}</div>}
      </div>
    );
  }
}));

const MOCK_PAGE_1 = {
  page: 1,
  total_pages: 2,
  total_results: 3,
  results: [
    { id: 1, title: 'Matrix 1', poster_path: '/img1.jpg', vote_average: 8 },
    { id: 2, title: 'Matrix 2', poster_path: '/img2.jpg', vote_average: 7 },
  ]
};

const MOCK_PAGE_2 = {
  page: 2,
  total_pages: 2,
  total_results: 3,
  results: [
    { id: 3, title: 'Matrix 3', poster_path: '/img3.jpg', vote_average: 9 },
  ]
};

const MOCK_NO_RESULTS = {
  page: 1,
  total_pages: 1,
  total_results: 0,
  results: []
};

const renderSearch = (query: string) => {
  mockedUseLocation.mockReturnValue({
    search: `?q=${query}`,
    pathname: '/search',
    hash: '',
    key: 'default',
    state: null,
  });
  return render(<Search />);
};

describe('Página Search', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    capturedNextFunction = () => {};
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('não deve chamar a API se o query for vazio', async () => {
    renderSearch("");
    
    await waitFor(() => {
      expect(screen.getByText(/Resultados para: ""/i)).toBeInTheDocument();
    });
    
    expect(screen.getByText(/Encontrados 0 filmes/i)).toBeInTheDocument();
    expect(mockedSearchMovies).not.toHaveBeenCalled();
    expect(screen.queryByTestId('movie-card')).not.toBeInTheDocument();
  });

  it('deve mostrar 0 resultados se a API não retornar filmes', async () => {
    mockedSearchMovies.mockResolvedValue(MOCK_NO_RESULTS);
    renderSearch("asdfg");

    const heading = await screen.findByRole('heading', { 
        name: /Resultados para: "asdfg"/i 
        });
    expect(heading).toBeInTheDocument();
    
    expect(screen.getByText(/Encontrados 0 filmes/i)).toBeInTheDocument();
    expect(mockedSearchMovies).toHaveBeenCalledWith(1, "asdfg");
    expect(screen.queryByTestId('movie-card')).not.toBeInTheDocument();
  });

  it('deve carregar e mostrar a primeira página de resultados', async () => {
    mockedSearchMovies.mockResolvedValue(MOCK_PAGE_1);
    renderSearch("matrix");

    expect(await screen.findByText('Matrix 1')).toBeInTheDocument();
    expect(screen.getByText('Matrix 2')).toBeInTheDocument();
    expect(screen.getAllByTestId('movie-card')).toHaveLength(2);
    
    expect(screen.getByRole('heading', { 
        name: /Resultados para: "matrix"/i 
    })).toBeInTheDocument();
    expect(screen.getByText(/Encontrados 3 filmes/i)).toBeInTheDocument();
    
    expect(mockedSearchMovies).toHaveBeenCalledTimes(1);
    expect(mockedSearchMovies).toHaveBeenCalledWith(1, "matrix");
    
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve carregar mais filmes ao simular scroll', async () => {
    mockedSearchMovies.mockResolvedValueOnce(MOCK_PAGE_1);
    renderSearch("matrix");
    
    expect(await screen.findByText('Matrix 1')).toBeInTheDocument();
    expect(screen.getAllByTestId('movie-card')).toHaveLength(2);

    mockedSearchMovies.mockResolvedValueOnce(MOCK_PAGE_2);
    
    await act(async () => {
      capturedNextFunction();
    });

    expect(await screen.findByText('Matrix 3')).toBeInTheDocument();
    expect(screen.getAllByTestId('movie-card')).toHaveLength(3);
    
    expect(mockedSearchMovies).toHaveBeenCalledTimes(2);
    expect(mockedSearchMovies).toHaveBeenCalledWith(2, "matrix");
    
    expect(screen.getByText('Matrix 1')).toBeInTheDocument();
  });

  it('deve mostrar a mensagem de "fim" quando não houver mais páginas', async () => {
    mockedSearchMovies.mockResolvedValueOnce(MOCK_PAGE_1);
    renderSearch("matrix");
    
    expect(await screen.findByText('Matrix 1')).toBeInTheDocument();
    
    mockedSearchMovies.mockResolvedValueOnce(MOCK_PAGE_2);
    
    await act(async () => {
      capturedNextFunction();
    });

    expect(await screen.findByText('Matrix 3')).toBeInTheDocument();
    
    expect(screen.getByText(/Você já viu tudo!/i)).toBeInTheDocument();
    expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
  });

  it('deve passar a prop highlightQuery para os MovieCards', async () => {
    mockedSearchMovies.mockResolvedValue(MOCK_PAGE_1);
    renderSearch("matrix");
    
    expect(await screen.findByText('Matrix 1')).toBeInTheDocument();
    
    const cards = screen.getAllByTestId('movie-card');
    expect(cards[0]).toHaveAttribute('data-highlight', 'matrix');
    expect(cards[1]).toHaveAttribute('data-highlight', 'matrix');
  });

  it('deve fazer uma nova busca ao mudar o query da URL', async () => {
    mockedSearchMovies.mockResolvedValueOnce(MOCK_PAGE_1);
    const { rerender } = renderSearch("matrix");
    
    expect(await screen.findByText('Matrix 1')).toBeInTheDocument();
    expect(screen.getAllByTestId('movie-card')).toHaveLength(2);
    expect(mockedSearchMovies).toHaveBeenCalledWith(1, "matrix");

    const MOCK_ALIEN = { 
      results: [{ id: 4, title: 'Alien' }], 
      page: 1, 
      total_pages: 1, 
      total_results: 1 
    };
    mockedSearchMovies.mockResolvedValueOnce(MOCK_ALIEN);

    mockedUseLocation.mockReturnValue({
      search: `?q=alien`,
      pathname: '/search',
      hash: '',
      key: 'new-key',
      state: null,
    });
    
    rerender(<Search />);

    expect(await screen.findByText('Alien')).toBeInTheDocument();
    expect(screen.getAllByTestId('movie-card')).toHaveLength(1);
    expect(screen.queryByText('Matrix 1')).not.toBeInTheDocument();
    
    expect(screen.getByRole('heading', { 
        name: /Resultados para: "alien"/i 
    })).toBeInTheDocument();
    expect(screen.getByText(/Encontrados 1 filmes/i)).toBeInTheDocument();
    
    expect(mockedSearchMovies).toHaveBeenCalledTimes(2);
    expect(mockedSearchMovies).toHaveBeenCalledWith(1, "alien");
  });
});