import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '@testing-library/jest-dom';

vi.mock('react-icons/bi', () => ({
  BiSearchAlt2: () => <svg data-testid="search-icon" />,
}));

vi.mock('lucide-react', () => ({
  Film: () => <svg data-testid="film-icon" />,
  Menu: () => <svg data-testid="menu-icon" />,
  ChevronLeft: () => <svg data-testid="chevron-left-icon" />,
  House: () => <svg data-testid="house-icon" />,
  Heart: () => <svg data-testid="heart-icon" />,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    useNavigate: () => mockNavigate,
  };
});

const renderComponent = (route = '/') => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <NavBar />
    </MemoryRouter>
  );
};

describe('Componente NavBar', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o logo, links de desktop e formulário de busca', () => {
    renderComponent();

    expect(screen.getByRole('link', { name: /MovieDB/i })).toBeInTheDocument();
    expect(screen.getByTestId('film-icon')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Buscar filmes...')).toBeInTheDocument();

    const mainNav = screen.getByRole('navigation');

    expect(within(mainNav).getAllByRole('link', { name: 'Home' })
    ).toHaveLength(2);

    expect(
      within(mainNav).getAllByRole('link', { name: 'Favoritos' })
    ).toHaveLength(2);

    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
  });

  it('deve navegar para a busca ao submeter o formulário com texto', () => {
    renderComponent();

    const input = screen.getByPlaceholderText('Buscar filmes...');
    const form = input.closest('form') as HTMLFormElement;

    fireEvent.change(input, { target: { value: 'matrix' } });
    expect((input as HTMLInputElement).value).toBe('matrix');

    fireEvent.submit(form);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/search?q=matrix');
    expect((input as HTMLInputElement).value).toBe('');
  });

  it('não deve navegar se o formulário for submetido vazio', () => {
    renderComponent();
    
    const input = screen.getByPlaceholderText('Buscar filmes...');
    const form = input.closest('form') as HTMLFormElement;

    fireEvent.submit(form);
    
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('não deve navegar se o formulário for submetido com espaços', () => {
    renderComponent();

    const input = screen.getByPlaceholderText('Buscar filmes...');
    const form = input.closest('form') as HTMLFormElement;

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(form);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('deve abrir e fechar o menu mobile ao clicar no botão', () => {
    renderComponent();
    const sidebarContent = document.querySelector('div.flex-col');
    const sidebarContainer = sidebarContent?.parentElement as HTMLElement;
    expect(sidebarContainer).toHaveClass('-translate-x-full');
    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('chevron-left-icon')).not.toBeInTheDocument();
    
    const menuButton = screen.getByTestId('menu-icon').closest('button') as HTMLButtonElement;
    fireEvent.click(menuButton);

    expect(sidebarContainer).toHaveClass('translate-x-0');
    expect(sidebarContainer).not.toHaveClass('-translate-x-full');
    expect(screen.getByTestId('chevron-left-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('menu-icon')).not.toBeInTheDocument();

    const closeButton = screen.getByTestId('chevron-left-icon').closest('button') as HTMLButtonElement;
    fireEvent.click(closeButton);

    expect(sidebarContainer).toHaveClass('-translate-x-full');
    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('chevron-left-icon')).not.toBeInTheDocument();
  });

  it('deve fechar o menu mobile ao clicar em um link da sidebar', () => {
    renderComponent();
    
    const sidebarContent = document.querySelector('div.flex-col') as HTMLElement;
    const sidebarContainer = sidebarContent.parentElement as HTMLElement;
    const menuButton = screen.getByTestId('menu-icon').closest('button') as HTMLButtonElement;

    fireEvent.click(menuButton);
    expect(sidebarContainer).toHaveClass('translate-x-0');
    expect(screen.getByTestId('chevron-left-icon')).toBeInTheDocument();
    
    const mobileFavoritesLink = within(sidebarContent as HTMLElement).getByRole('link', { name: 'Favoritos' });
    fireEvent.click(mobileFavoritesLink);
    
    expect(sidebarContainer).toHaveClass('-translate-x-full');
    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('chevron-left-icon')).not.toBeInTheDocument();
  });

  it('deve aplicar a classe ativa apenas aos links da Home na rota /', () => {
    renderComponent('/');
    
    const homeLinks = screen.getAllByRole('link', { name: /Home/i });
    const favoritesLinks = screen.getAllByRole('link', { name: /Favoritos/i });

    expect(homeLinks[0]).toHaveClass('bg-indigo-600');
    expect(homeLinks[1]).toHaveClass('bg-indigo-600');
    expect(favoritesLinks[0]).not.toHaveClass('bg-indigo-600');
    expect(favoritesLinks[1]).not.toHaveClass('bg-indigo-600');
  });

  it('deve aplicar a classe ativa apenas aos links de Favoritos na rota /favorites', () => {
    renderComponent('/favorites');
    
    const homeLinks = screen.getAllByRole('link', { name: /Home/i });
    const favoritesLinks = screen.getAllByRole('link', { name: /Favoritos/i });

    expect(homeLinks[0]).not.toHaveClass('bg-indigo-600');
    expect(homeLinks[1]).not.toHaveClass('bg-indigo-600');
    expect(favoritesLinks[0]).toHaveClass('bg-indigo-600');
    expect(favoritesLinks[1]).toHaveClass('bg-indigo-600');
  });

  it('não deve aplicar a classe ativa em outras rotas', () => {
    renderComponent('/search?q=test');
    
    const homeLinks = screen.getAllByRole('link', { name: /Home/i });
    const favoritesLinks = screen.getAllByRole('link', { name: /Favoritos/i });

    expect(homeLinks[0]).not.toHaveClass('bg-indigo-600');
    expect(homeLinks[1]).not.toHaveClass('bg-indigo-600');
    expect(favoritesLinks[0]).not.toHaveClass('bg-indigo-600');
    expect(favoritesLinks[1]).not.toHaveClass('bg-indigo-600');
  });
});