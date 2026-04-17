import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Home } from '../pages/Home';

describe('Home', () => {
  it('renders home page title', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText('Guiagreste')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText(/descubra as melhores marcas/i)).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText(/buscar marcas/i)).toBeInTheDocument();
  });

  it('renders categories section', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText('Categorias')).toBeInTheDocument();
  });

  it('renders featured brands section', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText('Marcas em Destaque')).toBeInTheDocument();
  });
});
