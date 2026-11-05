/**
 * Contratos de domínio compartilhados do Weather App.
 *
 * Decisão de arquitetura: as temperaturas são sempre armazenadas em Celsius
 * internamente e convertidas apenas na camada de apresentação. Assim, a troca
 * de unidade (C/F) nunca dispara um novo request.
 */

export type Unit = 'celsius' | 'fahrenheit';

/** Resultado da API de geocoding (uma cidade). */
export interface City {
  id: number;
  name: string;
  region: string | null;
  country: string | null;
  latitude: number;
  longitude: number;
}

/** Condições atuais da spec. Temperatura sempre em °C. */
export interface CurrentWeather {
  temperatureC: number | null;
  weatherCode: number | null;
  referenceTimeLocal: string | null;
  humidityPercent: number | null;
  windSpeedKmh: number | null;
  precipitationMm: number | null;
  pressureHpa: number | null;
}

/** Um dia da previsão. Temperaturas sempre em °C. */
export interface ForecastDay {
  localDate: string;
  minimumC: number | null;
  maximumC: number | null;
  weatherCode: number | null;
  precipitationProbabilityMaxPercent: number | null;
}

export type FiveDayForecast = [ForecastDay, ForecastDay, ForecastDay, ForecastDay, ForecastDay];

/** Agregado entregue à UI: cidade + clima atual + cinco datas locais. */
export interface WeatherData {
  city: City;
  current: CurrentWeather;
  forecast: [ForecastDay, ForecastDay, ForecastDay, ForecastDay, ForecastDay];
}
