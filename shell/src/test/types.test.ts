import { describe, it, expect } from 'vitest';
import type { User, Brand, Post, Message } from '../types';

describe('types', () => {
  it('should define User type correctly', () => {
    const user: User = {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
      type: 'user',
    };

    expect(user.id).toBe(1);
    expect(user.type).toBe('user');
  });

  it('should define Brand type correctly', () => {
    const brand: Brand = {
      id: 1,
      name: 'Vanessa Modas',
      email: 'contato@vanessamodas.com.br',
      phone: '(81) 3731-1234',
      address: 'Moda Center Santa Cruz',
      description: 'Moda feminina elegante.',
      categories: ['Feminino', 'Acessórios'],
      logo: 'https://example.com/logo.jpg',
      instagram: '@vanessamodas',
      facebook: 'Vanessa Modas',
      website: 'https://vanessamodas.com.br',
      cnpj: '12.345.678/0001-90',
      whatsapp: '(81) 99999-1234',
      followersCount: 150,
      type: 'brand',
    };

    expect(brand.id).toBe(1);
    expect(brand.type).toBe('brand');
    expect(brand.categories).toHaveLength(2);
  });

  it('should define Post type correctly', () => {
    const post: Post = {
      id: 1,
      brandId: 1,
      brandName: 'Vanessa Modas',
      brandLogo: 'https://example.com/logo.jpg',
      image: 'https://example.com/product.jpg',
      caption: 'Novo produto!',
      createdAt: '2024-01-01T00:00:00Z',
    };

    expect(post.id).toBe(1);
    expect(post.brandId).toBe(1);
  });

  it('should define Message type correctly', () => {
    const message: Message = {
      id: 1,
      conversationId: 1,
      senderId: 1,
      senderType: 'user',
      content: 'Olá!',
      createdAt: '2024-01-01T00:00:00Z',
    };

    expect(message.senderType).toMatch(/^(user|brand)$/);
  });
});
