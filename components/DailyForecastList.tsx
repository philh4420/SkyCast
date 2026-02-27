
import React from 'react';
import { DailyForecast } from '../api/_shared/types';
import { WEATHER_ICONS } from '../icons';
import { CalendarDays, Droplets, Umbrella, Wind, Sun, Moon, Sunrise, Sunset } from 'lucide-react';

interface DailyForecastListProps {
  data: DailyForecast[];
  unit: 'metric' | 'imperial';
}

export const DailyForecastList: React.FC<DailyForecastListProps> = ({ data, unit }) => {
  const forecastData = data.slice(0, 10); 
  
  if (!forecastData.length) return null;

  const minOfAll = Math.min(...forecastData.map(d => d.tempMin));
  const maxOfAll = Math.max(...forecastData.map(d => d.tempMax));
  const range = maxOfAll - minOfAll;

  return (
    <div className="bg-black/20 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl">
      <div className="flex items-center mb-4 px-2 opacity-70">
         <CalendarDays className="w-4 h-4 mr-2" />
         <h3 className="text-sm font-medium uppercase tracking-wider">10-Day Forecast</h3>
      </div>
      
      <div className="flex flex-col">
        {forecastData.map((day, idx) => {
          const date = new Date(day.date);
          const dayName = idx === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
          const icon = WEATHER_ICONS[day.iconCode] || WEATHER_ICONS['cloudy'];

          const max = unit === 'metric' ? Math.round(day.tempMax) : Math.round(day.tempMax * 9/5 + 32);
          const min = unit === 'metric' ? Math.round(day.tempMin) : Math.round(day.tempMin * 9/5 + 32);
          
          const leftOffset = ((day.tempMin - minOfAll) / range) * 100;
          const barWidth = ((day.tempMax - day.tempMin) / range) * 100;

          return (
            <div key={idx} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 px-2 group">
              
              {/* Day Name */}
              <div className="w-16 text-lg font-medium">
                 {dayName}
              </div>
              
              {/* Icon & Rain Chance */}
              <div className="flex flex-col items-center w-12">
                 <div className="w-8 h-8 opacity-90 filter drop-shadow-md">{icon}</div>
                 {day.precipitationProb !== undefined && day.precipitationProb > 20 && (
                    <span className="text-[10px] font-bold text-blue-300 mt-0.5">{day.precipitationProb}%</span>
                 )}
              </div>

              {/* Temperature Bar */}
              <div className="flex items-center flex-1 ml-4 gap-3">
                 <span className="text-lg font-medium opacity-60 w-8 text-right">{min}°</span>
                 
                 <div className="flex-1 h-1.5 bg-black/30 rounded-full overflow-hidden relative">
                    <div 
                      className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 via-green-400 to-orange-400 opacity-80"
                      style={{ left: `${leftOffset}%`, width: `${barWidth}%` }}
                    />
                 </div>

                 <span className="text-lg font-medium w-8">{max}°</span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
