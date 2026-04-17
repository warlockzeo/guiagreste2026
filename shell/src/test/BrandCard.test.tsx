import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { BrandCard } from '../components/BrandCard';
import type { Brand } from '../types';

const mockBrand: Brand = {
  id: 1,
  name: 'Vanessa Modas',
  email: 'contato@vanessamodas.com.br',
  phone: '(81) 3731-1234',
  address: 'Moda Center Santa Cruz',
  description: 'Moda feminina elegante e moderna.',
  categories: ['Feminino', 'Acessórios'],
  logo: 'https://example.com/logo.jpg',
  instagram: '@vanessamodas',
  facebook: 'Vanessa Modas',
  website: '',
  cnpj: '12.345.678/0001-90',
  whatsapp: '(81) 99999-1234',
  followersCount: 150,
  type: 'brand',
};

describe('BrandCard', () => {
  it('renders brand name', () => {
    render(
      <BrowserRouter>
        <BrandCard brand={mockBrand} />
      </BrowserRouter>
    );
    expect(screen.getByText('Vanessa Modas')).toBeInTheDocument();
  });

  it('renders brand description', () => {
    render(
      <BrowserRouter>
        <BrandCard brand={mockBrand} />
      </BrowserRouter>
    );
    expect(screen.getByText('Moda feminina elegante e moderna.')).toBeInTheDocument();
  });

  it('renders categories', () => {
    render(
      <BrowserRouter>
        <BrandCard brand={mockBrand} />
      </BrowserRouter>
    );
    expect(screen.getByText('Feminino')).toBeInTheDocument();
    expect(screen.getByText('Acessórios')).toBeInTheDocument();
  });

  it('renders followers count', () => {
    render(
      <BrowserRouter>
        <BrandCard brand={mockBrand} />
      </BrowserRouter>
    );
    expect(screen.getByText('150 seguidores')).toBeInTheDocument();
  });

  it('renders brand image', () => {
    render(
      <BrowserRouter>
        <BrandCard brand={mockBrand} />
      </BrowserRouter>
    );
    const img = screen.getByAltText('Vanessa Modas') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe('https://example.com/logo.jpg');
  });
});
