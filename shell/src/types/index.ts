export interface User {
  id: number;
  name: string;
  email: string;
  type: 'user';
}

export interface Brand {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  categories: string[];
  logo: string;
  instagram: string;
  facebook: string;
  website: string;
  cnpj: string;
  whatsapp: string;
  followersCount: number;
  type: 'brand';
}

export interface Post {
  id: number;
  brandId: number;
  brandName: string;
  brandLogo: string;
  image: string;
  caption: string;
  createdAt: string;
}

export interface Conversation {
  id: number;
  userId: number;
  brandId: number;
  brandName: string;
  brandLogo: string;
  lastMessage: string;
  createdAt: string;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  senderType: 'user' | 'brand';
  content: string;
  createdAt: string;
}

export interface AuthState {
  user: User | Brand | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User | Brand, token: string) => void;
  logout: () => void;
}
