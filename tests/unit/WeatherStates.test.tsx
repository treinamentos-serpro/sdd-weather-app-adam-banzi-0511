import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import EmptyState from '../../src/components/states/EmptyState';
import ErrorState from '../../src/components/states/ErrorState';
import LoadingState from '../../src/components/states/LoadingState';

describe('Weather state components', () => {
  it('expõe o carregamento como status acessível', () => {
    render(<LoadingState />);

    expect(screen.getByRole('status')).toHaveTextContent('Carregando o clima');
  });

  it('exibe mensagem de erro e permite tentar novamente', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState message="Falha de rede" onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Falha de rede');
    await user.click(screen.getByRole('button', { name: /tentar novamente/i }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('exibe título e dica do estado vazio', () => {
    render(<EmptyState title="Nenhuma cidade encontrada" hint="Revise a grafia." />);

    expect(screen.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeInTheDocument();
    expect(screen.getByText('Revise a grafia.')).toBeInTheDocument();
  });
});