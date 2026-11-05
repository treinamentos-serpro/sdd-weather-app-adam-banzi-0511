import type { ForecastDay, Unit } from '../types/weather';
import { formatTemperature } from '../lib/temperature';
import { getWeatherIcon, getWeatherLabel } from '../lib/weatherCodes';
import { getDayLabel, getShortDate } from '../lib/format';

interface ForecastCardProps {
  day: ForecastDay;
  index: number;
  unit: Unit;
}

/** Card de um dia da previsão. */
export default function ForecastCard({ day, index, unit }: ForecastCardProps) {
  const temperature = (value: number | null) =>
    value === null ? 'Indisponível' : formatTemperature(value, unit);

  return (
    <li className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md">
      <p className="font-semibold">{getDayLabel(day.localDate, index)}</p>
      <p className="text-xs text-white/50">{getShortDate(day.localDate)}</p>
      {day.weatherCode === null ? (
        <p className="text-xs text-white/60">Condição indisponível</p>
      ) : (
        <>
          <span aria-hidden="true" className="text-3xl">
            {getWeatherIcon(day.weatherCode)}
          </span>
          <p className="text-xs text-white/70">{getWeatherLabel(day.weatherCode)}</p>
        </>
      )}
      <p className="text-sm">
        <span className="font-semibold">{temperature(day.maximumC)}</span>{' '}
        <span className="text-white/50">{temperature(day.minimumC)}</span>
      </p>
      <p className="text-xs text-accent-400">
        {day.precipitationProbabilityMaxPercent === null
          ? 'Chuva indisponível'
          : `Chuva ${day.precipitationProbabilityMaxPercent}%`}
      </p>
    </li>
  );
}
