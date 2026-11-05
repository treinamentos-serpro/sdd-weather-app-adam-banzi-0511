import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import CurrentWeather from '../../src/components/CurrentWeather';
import UnitToggle from '../../src/components/UnitToggle';
import type { City, CurrentWeather as CurrentWeatherType, Unit } from '../../src/types/weather';

const city: City = {
  id: 1,
  name: 'Seattle',
  region: 'Washington',
  country: 'Estados Unidos',
  latitude: 47.6,
  longitude: -122.33,
};

const current: CurrentWeatherType = {
  referenceTimeLocal: '2026-06-16T12:00',
  temperatureC: 0, // 0°C => 32°F (fácil de verificar)
  weatherCode: 3,
  humidityPercent: 62,
  windSpeedKmh: 12.5,
  precipitationMm: 0.2,
  pressureHpa: 1012.4,
};

function Harness() {
  const [unit, setUnit] = useState<Unit>('celsius');
  return (
    <>
      <UnitToggle unit={unit} onChange={setUnit} />
      <CurrentWeather city={city} current={current} unit={unit} />
    </>
  );
}

describe('UnitToggle + CurrentWeather', () => {
  it('converte a temperatura ao alternar a unidade', async () => {
    render(<Harness />);
    expect(screen.getByText('0°')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '°F' }));
    expect(screen.getByText('32°')).toBeInTheDocument();
  });

  it('expõe os botões com estado pressionado acessível', () => {
    render(<Harness />);
    expect(screen.getByRole('button', { name: '°C' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('exibe as métricas atuais com unidades e formatação pt-BR', () => {
    render(<Harness />);

    expect(screen.getByText('Umidade').nextElementSibling).toHaveTextContent('62 %');
    expect(screen.getByText('Vento').nextElementSibling).toHaveTextContent('12,5 km/h');
    expect(screen.getByText('Precipitação').nextElementSibling).toHaveTextContent('0,2 mm');
    expect(screen.getByText('Pressão').nextElementSibling).toHaveTextContent('1.012,4 hPa');
  });

  it('marca métricas ausentes como indisponíveis sem substituí-las por zero', () => {
    render(
      <CurrentWeather
        city={city}
        current={{
          ...current,
          humidityPercent: null,
          windSpeedKmh: null,
          precipitationMm: null,
          pressureHpa: null,
        }}
        unit="celsius"
      />,
    );

    expect(screen.getAllByText('Indisponível')).toHaveLength(4);
  });

  it('navega e alterna a unidade com as setas do teclado', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const celsiusButton = screen.getByRole('button', { name: '°C' });
    const fahrenheitButton = screen.getByRole('button', { name: '°F' });

    celsiusButton.focus();
    await user.keyboard('{ArrowRight}');
    expect(fahrenheitButton).toHaveFocus();
    expect(fahrenheitButton).toHaveAttribute('aria-pressed', 'true');

    await user.keyboard('{ArrowLeft}');
    expect(celsiusButton).toHaveFocus();
    expect(celsiusButton).toHaveAttribute('aria-pressed', 'true');
  });
});
