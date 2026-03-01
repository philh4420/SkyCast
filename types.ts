
export interface WeatherAlert {
  headline: string;
  severity: string;
  urgency: string;
  areas: string;
  desc: string;
  instruction: string;
}

export interface WeatherData {
  current: {
    temp: number;
    condition: string;
    description: string;
    iconCode: string; // Generic icon mapping key
    humidity: number;
    windSpeed: number;
    windDir?: number; // Degrees
    windGust?: number; // km/h
    feelsLike: number;
    dewPoint?: number; // Celsius
    pressure: number;
    uvIndex?: number;
    visibility?: number; // km
    cloudCover?: number; // %
    aqi?: number; // US AQI Standard
    sunrise?: string;
    sunset?: string;
    moonrise?: string;
    moonset?: string;
    moonIllumination?: number;
    soilTemp?: number;
    airQuality?: AirQualityData;
  };
  forecast: DailyForecast[];
  hourly: HourlyForecast[];
  alerts?: WeatherAlert[];
  location: {
    city: string;
    country: string;
    lat: number;
    lon: number;
  };
  sources: string[]; // List of APIs used for this result
}

export interface AirQualityData {
  pm2_5: number;
  pm10: number;
  no2: number;
  o3: number;
  so2: number;
  co: number;
  pollen: {
    grass: number;
    tree: number; // Averaged or specific (Birch/Alder)
    weed: number; // Averaged or specific (Ragweed/Mugwort)
    olive: number;
  };
}

export interface DailyForecast {
  date: string; // ISO date string
  tempMax: number;
  tempMin: number;
  condition: string;
  iconCode: string;
  precipitationProb?: number;
  totalPrecip?: number; // mm
  uvIndex?: number;
  moonPhase?: string;
  sunrise?: string;
  sunset?: string;
  windSpeed?: number;
  windDir?: number;
  humidity?: number;
}

export interface HourlyForecast {
  time: string; // ISO string
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDir?: number;
  precipProb: number;
  uvIndex?: number;
  iconCode: string;
  condition?: string; // Short text description if available
}

export enum WeatherProvider {
  OPEN_METEO = 'Open-Meteo',
  OPEN_WEATHER_MAP = 'OpenWeatherMap',
  WEATHER_API = 'WeatherAPI.com'
}

export interface WidgetConfig {
  id: string;
  visible: boolean;
}

export interface UserSettings {
  units: 'metric' | 'imperial';
  theme: 'light' | 'dark';
  widgets?: WidgetConfig[];
}

export interface GeoLocation {
  lat: number;
  lon: number;
  name?: string;
}
