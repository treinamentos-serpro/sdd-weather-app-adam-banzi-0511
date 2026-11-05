import type { WeatherData } from '../types/weather';

/** Dados fixos para desenvolver e visualizar a UI sem chamar a Open-Meteo. */
export const mockWeatherData: WeatherData = {
  city: {
    id: 3448439,
    name: 'São Paulo',
    region: 'São Paulo',
    country: 'Brasil',
    latitude: -23.5475,
    longitude: -46.63611,
  },
  current: {
    temperatureC: 22.4,
    weatherCode: 2,
    referenceTimeLocal: '2026-11-05T12:00',
    humidityPercent: 62,
    windSpeedKmh: 12.5,
    precipitationMm: 0.2,
    pressureHpa: 1012.4,
  },
  forecast: [
    {
      localDate: '2026-11-05',
      minimumC: 17.1,
      maximumC: 25.6,
      weatherCode: 2,
      precipitationProbabilityMaxPercent: 10,
    },
    {
      localDate: '2026-11-06',
      minimumC: 18,
      maximumC: 26.1,
      weatherCode: 3,
      precipitationProbabilityMaxPercent: 20,
    },
    {
      localDate: '2026-11-07',
      minimumC: 19.2,
      maximumC: 27,
      weatherCode: 61,
      precipitationProbabilityMaxPercent: 80,
    },
    {
      localDate: '2026-11-08',
      minimumC: 18.5,
      maximumC: 24.9,
      weatherCode: 2,
      precipitationProbabilityMaxPercent: 5,
    },
    {
      localDate: '2026-11-09',
      minimumC: 17.8,
      maximumC: 25.2,
      weatherCode: 1,
      precipitationProbabilityMaxPercent: null,
    },
  ],
};
