import React from 'react';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, Moon, CloudSun, Wind } from 'lucide-react';

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
