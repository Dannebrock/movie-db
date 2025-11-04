// src/components/NavBar/NavBar.test.tsx

import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '@testing-library/jest-dom';

// Mock icons
vi.mock('react-icons/bi', () => ({
  BiSearchAlt2: () => <svg data-testid="search-icon" />,
}));
vi.mock('lucide-react', () => ({
  Film: () => <svg data-testid="film-icon" />,
  Menu: () => <svg data-testid="menu-icon" />,
  ChevronLeft: () => <svg data-testid="chevron-left-icon" />,
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    useNavigate: () => mockNavigate,
  };
});

const renderComponent = () => {
  return render(
    <MemoryRouter>
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

    expect(  within(mainNav).getAllByRole('link', { name: 'Home' })
    ).toHaveLength(2); 

    expect(
    within(mainNav).getAllByRole('link', { name: 'Favoritos' })
    ).toHaveLength(2); // Espera encontrar 2 links "Favoritos"

    // Encontra o botão de menu (mobile)
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

    it('deve fechar o menu mobile ao clicar em um link da sidebar', () => {
    renderComponent();
   
    const sidebarContent = document.querySelector('div.flex-col'); 
    const sidebarContainer = sidebarContent?.parentElement as HTMLElement;
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
});