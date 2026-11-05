import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ForecastList from '../../src/components/ForecastList';
import { mockWeatherData } from '../../src/lib/mockWeatherData';

describe('ForecastList', () => {
  it('renderiza cinco cards com probabilidade de chuva ou estado indisponível', () => {
    render(<ForecastList forecast={mockWeatherData.forecast} unit="celsius" />);

    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    expect(screen.getByText('Chuva 10%')).toBeInTheDocument();
    expect(screen.getByText('Chuva 80%')).toBeInTheDocument();
    expect(screen.getByText('Chuva indisponível')).toBeInTheDocument();
  });
});