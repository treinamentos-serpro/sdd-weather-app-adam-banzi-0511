import { formatTemperature } from '../lib/temperature';
import { getWeatherIcon, getWeatherLabel } from '../lib/weatherCodes';
import type { City, CurrentWeather as CurrentWeatherType, Unit } from '../types/weather';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherType;
  unit: Unit;
}

interface Metric {
  label: string;
  value: number | null;
  unit: string;
  maximumFractionDigits?: number;
}

function formatMetric(value: number | null, unit: string, maximumFractionDigits = 1): string {
  if (value === null) return 'Indisponível';
  return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits }).format(value)} ${unit}`;
}

/** Hero com condições atuais e métricas da cidade selecionada. */
export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const location = [city.region, city.country].filter(Boolean).join(', ');
  const metrics: Metric[] = [
    { label: 'Umidade', value: current.humidityPercent, unit: '%' },
    { label: 'Vento', value: current.windSpeedKmh, unit: 'km/h' },
    { label: 'Precipitação', value: current.precipitationMm, unit: 'mm' },
    { label: 'Pressão', value: current.pressureHpa, unit: 'hPa' },
  ];

  return (
    <section
      aria-label="Clima atual"
      className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-glass md:p-8"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-bold md:text-3xl">{city.name}</h2>
          {location && <p className="text-white/60">{location}</p>}

          <div className="mt-6 flex items-center gap-4">
            {current.weatherCode !== null && (
              <span aria-hidden="true" className="text-6xl">
                {getWeatherIcon(current.weatherCode)}
              </span>
            )}
            <span className="text-6xl font-light md:text-7xl">
              {current.temperatureC === null
                ? 'Indisponível'
                : formatTemperature(current.temperatureC, unit)}
            </span>
          </div>
          <p className="mt-2 text-white/70">
            {current.weatherCode === null
              ? 'Condição indisponível'
              : getWeatherLabel(current.weatherCode)}
          </p>
          <p className="mt-1 text-xs text-white/50">
            {current.referenceTimeLocal
              ? `Referência local: ${current.referenceTimeLocal}`
              : 'Horário de referência indisponível'}
          </p>
        </div>
      </div>
      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/10 pt-5 sm:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <dt className="text-xs text-white/50">{metric.label}</dt>
            <dd className="mt-1 font-semibold">
              {formatMetric(metric.value, metric.unit, metric.maximumFractionDigits)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
