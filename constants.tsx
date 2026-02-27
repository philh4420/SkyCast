import React from 'react';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, Moon, CloudSun, Wind } from 'lucide-react';

export const DEFAULT_LAT = 40.7128; // NYC
export const DEFAULT_LON = -74.0060;

// Map generic icon codes to Lucide React components
export const WEATHER_ICONS: Record<string, React.ReactNode> = {
  'clear-day': <Sun className="w-full h-full text-yellow-400" />,
  'clear-night': <Moon className="w-full h-full text-blue-200" />,
  'partly-cloudy-day': <CloudSun className="w-full h-full text-orange-300" />,
  'partly-cloudy-night': <CloudSun className="w-full h-full text-gray-400" />,
  'cloudy': <Cloud className="w-full h-full text-gray-300" />,
  'rain': <CloudRain className="w-full h-full text-blue-400" />,
  'drizzle': <CloudDrizzle className="w-full h-full text-blue-300" />,
  'thunderstorm': <CloudLightning className="w-full h-full text-purple-400" />,
  'snow': <CloudSnow className="w-full h-full text-white" />,
  'mist': <CloudFog className="w-full h-full text-gray-400" />,
  'fog': <CloudFog className="w-full h-full text-gray-400" />,
  'wind': <Wind className="w-full h-full text-teal-300" />,
};

// Simple mapping from WMO codes (OpenMeteo) to our generic keys
export const WMO_CODE_MAP: Record<number, string> = {
  0: 'clear-day',
  1: 'partly-cloudy-day',
  2: 'partly-cloudy-day',
  3: 'cloudy',
  45: 'fog',
  48: 'fog',
  51: 'drizzle',
  53: 'drizzle',
  55: 'drizzle',
  61: 'rain',
  63: 'rain',
  65: 'rain',
  71: 'snow',
  73: 'snow',
  75: 'snow',
  80: 'rain',
  81: 'rain',
  82: 'rain',
  95: 'thunderstorm',
  96: 'thunderstorm',
  99: 'thunderstorm',
};
