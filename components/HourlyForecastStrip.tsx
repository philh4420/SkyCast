
import React from 'react';
import { HourlyForecast } from '../types';
import { WEATHER_ICONS } from '../icons';
import { Clock, Navigation, Droplets, Umbrella, ThermometerSun, Sun, Sunrise, Sunset } from 'lucide-react';

interface HourlyForecastStripProps {
  data: HourlyForecast[];
  unit: 'metric' | 'imperial';
  sunrise?: string;
  sunset?: string;
}

export const HourlyForecastStrip: React.FC<HourlyForecastStripProps> = ({ data, unit, sunrise, sunset }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center mb-4 px-2 opacity-70">
         <Clock className="w-4 h-4 mr-2" />
         <h3 className="text-sm font-medium uppercase tracking-wider">Hourly Forecast</h3>
      </div>
      
      <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide snap-x px-2">
        {data.slice(0, 24).map((hour, idx) => {
          const date = new Date(hour.time);
          const timeLabel = idx === 0 ? 'Now' : date.toLocaleTimeString([], { hour: 'numeric' });
          const icon = WEATHER_ICONS[hour.iconCode] || WEATHER_ICONS['cloudy'];
          const temp = unit === 'metric' ? Math.round(hour.temp) : Math.round(hour.temp * 9/5 + 32);
          
          return (
            <div 
              key={idx} 
              className="flex-none flex flex-col items-center justify-between h-32 snap-start group"
            >
              {/* Time */}
              <span className="text-sm font-medium opacity-90">{timeLabel}</span>
              
              {/* Icon & Rain */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 my-1 opacity-100 filter drop-shadow-md">
                  {icon}
                </div>
                {hour.precipProb > 20 && (
                  <span className="text-[11px] font-bold text-blue-300 mt-1">{Math.round(hour.precipProb)}%</span>
                )}
              </div>
              
              {/* Temp */}
              <span className="text-xl font-medium tracking-tight">{temp}°</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
