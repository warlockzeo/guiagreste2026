import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../components/Header';

const renderHeader = () => {
  return render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
};

describe('Header', () => {
  it('renders logo text', () => {
    renderHeader();
    expect(screen.getByText('Guiagreste')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderHeader();
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Catálogo')).toBeInTheDocument();
  });

  it('renders login and register buttons when not authenticated', () => {
    renderHeader();
    expect(screen.getByText('Entrar')).toBeInTheDocument();
    expect(screen.getByText('Cadastrar')).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    renderHeader();
    const themeButton = screen.getByRole('button', { name: /alternar tema/i });
    expect(themeButton).toBeInTheDocument();
  });
});
