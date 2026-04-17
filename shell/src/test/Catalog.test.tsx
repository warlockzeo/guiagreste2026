import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Catalog } from '../pages/Catalog';

describe('Catalog', () => {
  it('renders catalog page title', () => {
    render(
      <BrowserRouter>
        <Catalog />
      </BrowserRouter>
    );
    expect(screen.getByText('Catálogo de Marcas')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(
      <BrowserRouter>
        <Catalog />
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText(/buscar marcas/i)).toBeInTheDocument();
  });
});
