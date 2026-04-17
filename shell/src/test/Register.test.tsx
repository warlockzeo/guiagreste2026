import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Register } from '../pages/Register';

describe('Register', () => {
  it('renders register form', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    expect(screen.getByText('Cadastrar')).toBeInTheDocument();
  });

  it('renders name input', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
  });

  it('renders email input', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders password input', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
  });

  it('renders account type selector', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    expect(screen.getByText('Usuário')).toBeInTheDocument();
    expect(screen.getByText('Empresa')).toBeInTheDocument();
  });

  it('renders login link', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    expect(screen.getByText(/já tem conta/i)).toBeInTheDocument();
  });
});
