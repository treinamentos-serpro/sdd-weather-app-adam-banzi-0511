import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SearchBar from '../../src/components/SearchBar';

describe('SearchBar', () => {
  it('expõe uma região de busca e um campo com label acessível', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    expect(screen.getByRole('search', { name: 'Buscar cidades' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Buscar cidade' })).toBeInTheDocument();
  });

  it('não dispara busca com input vazio', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    await userEvent.click(screen.getByRole('button', { name: /buscar/i }));
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('dispara busca com o termo digitado', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    await userEvent.type(screen.getByRole('textbox', { name: /buscar cidade/i }), 'Lisboa');
    await userEvent.click(screen.getByRole('button', { name: /buscar/i }));
    expect(onSearch).toHaveBeenCalledWith('Lisboa');
  });

  it('remove espaços externos antes de chamar onSearch', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    await userEvent.type(screen.getByRole('textbox', { name: /buscar cidade/i }), '  Lisboa  ');
    await userEvent.click(screen.getByRole('button', { name: /buscar/i }));

    expect(onSearch).toHaveBeenCalledExactlyOnceWith('Lisboa');
  });

  it('desabilita o campo e o botão quando disabled é true', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} disabled />);
    const input = screen.getByRole('textbox', { name: /buscar cidade/i });

    expect(input).toBeDisabled();
    expect(screen.getByRole('button', { name: /buscar/i })).toBeDisabled();
    await userEvent.type(input, 'Lisboa');
    expect(onSearch).not.toHaveBeenCalled();
  });
});
