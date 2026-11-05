import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../../src/App';

describe('App', () => {
  it('renderiza o layout completo com dados de demonstração no estado inicial', () => {
    render(<App />);

    expect(screen.getByText('WeatherView')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/dados de demonstração/i);
    expect(screen.getByRole('heading', { name: 'São Paulo' })).toBeInTheDocument();
    expect(screen.getByText('22°')).toBeInTheDocument();
    expect(screen.getByText('Previsão de 5 dias')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    expect(screen.getByText('Chuva 80%')).toBeInTheDocument();
  });

  it('mostra a barra de busca e o alternador de unidade', () => {
    render(<App />);
    expect(screen.getByRole('textbox', { name: /buscar cidade/i })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /unidade de temperatura/i })).toBeInTheDocument();
  });
});
