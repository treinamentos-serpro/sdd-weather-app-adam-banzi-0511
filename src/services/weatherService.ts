import type { City, CurrentWeather, ForecastDay, WeatherData } from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const REQUEST_TIMEOUT_MS = 10_000;

/** Erro tipado da camada de dados, com mensagem amigável ao usuário. */
export class WeatherServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

/** Faz um fetch com timeout via AbortController. */
async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controller.signal });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new WeatherServiceError('A requisição demorou demais. Tente novamente.');
    }
    throw new WeatherServiceError('Falha de rede. Verifique sua conexão.');
  } finally {
    clearTimeout(timeout);
  }
}

interface GeocodingResult {
  id: number;
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

/**
 * Busca cidades por nome (geocoding). Retorna lista vazia quando não há
 * resultados — o estado "vazio" é tratado pela camada de UI.
 */
export async function searchCities(name: string): Promise<City[]> {
  const query = name.trim();
  if (!query) return [];

  const url = `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=5&language=pt&format=json`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) {
    throw new WeatherServiceError('Não foi possível buscar a cidade. Tente novamente.');
  }

  const data = (await res.json()) as { results?: GeocodingResult[] };
  if (!data.results) return [];

  return data.results.map((r) => ({
    id: r.id,
    name: r.name,
    country: r.country ?? null,
    region: r.admin1 ?? null,
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

interface ForecastResponse {
  current?: {
    time?: string;
    temperature_2m?: number | null;
    weather_code?: number | null;
    relative_humidity_2m?: number | null;
    wind_speed_10m?: number | null;
    precipitation?: number | null;
    surface_pressure?: number | null;
  };
  daily?: {
    time?: (string | null)[];
    weather_code?: (number | null)[];
    temperature_2m_max?: (number | null)[];
    temperature_2m_min?: (number | null)[];
    precipitation_probability_max?: (number | null)[];
  };
}

function mapCurrent(c: NonNullable<ForecastResponse['current']>): CurrentWeather {
  return {
    referenceTimeLocal: c.time ?? null,
    temperatureC: toNullableNumber(c.temperature_2m),
    weatherCode: toNullableNumber(c.weather_code),
    humidityPercent: toNullableNumber(c.relative_humidity_2m),
    windSpeedKmh: toNullableNumber(c.wind_speed_10m),
    precipitationMm: toNullableNumber(c.precipitation),
    pressureHpa: toNullableNumber(c.surface_pressure),
  };
}

function toNullableNumber(value: number | null | undefined): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function isLocalDate(value: string | null | undefined): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function addDays(localDate: string, days: number): string {
  const [year, month, day] = localDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

function mapForecast(
  daily: NonNullable<ForecastResponse['daily']>,
  currentTime: string | undefined,
): WeatherData['forecast'] {
  const firstDate = isLocalDate(daily.time?.[0])
    ? daily.time[0]
    : isLocalDate(currentTime?.slice(0, 10))
      ? currentTime.slice(0, 10)
      : null;

  if (!firstDate) {
    throw new WeatherServiceError('Resposta de previsão sem data local válida. Tente novamente.');
  }

  const mapDay = (index: number): ForecastDay => {
    const date = daily.time?.[index];
    return {
      localDate: isLocalDate(date) ? date : addDays(firstDate, index),
      minimumC: toNullableNumber(daily.temperature_2m_min?.[index]),
      maximumC: toNullableNumber(daily.temperature_2m_max?.[index]),
      weatherCode: toNullableNumber(daily.weather_code?.[index]),
      precipitationProbabilityMaxPercent: toNullableNumber(
        daily.precipitation_probability_max?.[index],
      ),
    };
  };

  return [mapDay(0), mapDay(1), mapDay(2), mapDay(3), mapDay(4)];
}

/**
 * Busca o clima atual e a previsão de 5 dias para uma cidade.
 * Temperaturas retornam em Celsius (conversão fica na UI).
 */
export async function getWeather(city: City): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current:
      'temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,precipitation,surface_pressure',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    forecast_days: '5',
    timezone: 'auto',
    temperature_unit: 'celsius',
    wind_speed_unit: 'kmh',
    precipitation_unit: 'mm',
  });

  const res = await fetchWithTimeout(`${FORECAST_URL}?${params.toString()}`);
  if (!res.ok) {
    throw new WeatherServiceError('Não foi possível carregar o clima. Tente novamente.');
  }

  const data = (await res.json()) as ForecastResponse;
  if (!data.current || !data.daily) {
    throw new WeatherServiceError('Resposta de clima incompleta. Tente novamente.');
  }

  return {
    city,
    current: mapCurrent(data.current),
    forecast: mapForecast(data.daily, data.current.time),
  };
}
