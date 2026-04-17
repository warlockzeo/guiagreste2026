import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { BrandCard } from '../components/BrandCard';
import type { Brand } from '../types';

const meta: Meta<typeof BrandCard> = {
  title: 'Components/BrandCard',
  component: BrandCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BrandCard>;

const mockBrand: Brand = {
  id: 1,
  name: 'Vanessa Modas',
  email: 'contato@vanessamodas.com.br',
  phone: '(81) 3731-1234',
  address: 'Moda Center Santa Cruz, Box 142',
  description: 'Moda feminina elegante e moderna. Peças únicas para todas as ocasiões.',
  categories: ['Feminino', 'Acessórios'],
  logo: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=200&h=200&fit=crop',
  instagram: '@vanessamodas',
  facebook: 'Vanessa Modas',
  website: '',
  cnpj: '12.345.678/0001-90',
  whatsapp: '(81) 99999-1234',
  followersCount: 150,
  type: 'brand',
};

export const Default: Story = {
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div style={{ padding: '20px', maxWidth: '300px' }}>
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
  args: {
    brand: mockBrand,
  },
};
