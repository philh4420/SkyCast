
import React from 'react';
import { DailyForecast } from '../types';
import { WeatherIcon } from '../icons';
import { CalendarDays } from 'lucide-react';

interface DailyForecastListProps {
  data: DailyForecast[];
  unit: 'metric' | 'imperial';
  theme: 'light' | 'dark';
}

export const DailyForecastList: React.FC<DailyForecastListProps> = ({ data, unit, theme }) => {
  const forecastData = data.slice(0, 10); 
  const isDark = theme === 'dark';
  
  if (!forecastData.length) return null;

  const minOfAll = Math.min(...forecastData.map(d => d.tempMin));
  const maxOfAll = Math.max(...forecastData.map(d => d.tempMax));
  const range = maxOfAll - minOfAll;

  const containerClass = isDark 
    ? 'bg-white/5 border-white/10' 
    : 'bg-white/50 border-slate-200/80';
    
  const textPrimary = isDark ? 'text-white' : 'text-slate-800';
  const textSecondary = isDark ? 'opacity-60' : 'text-slate-500';
  const borderClass = isDark ? 'border-white/10' : 'border-slate-200/60';
  const barBg = isDark ? 'bg-black/20' : 'bg-slate-300/50';

  return (
    <div className={`${containerClass} rounded-3xl p-6 backdrop-blur-2xl border`}>
      <div className={`flex items-center mb-4 px-2 ${isDark ? 'opacity-70' : 'text-slate-600'}`}>
         <CalendarDays className="w-4 h-4 mr-2" />
         <h3 className="text-sm font-medium uppercase tracking-wider">10-Day Forecast</h3>
      </div>
      
      <div className={`flex flex-col ${textPrimary}`}>
        {forecastData.map((day, idx) => {
          const date = new Date(day.date);
          const dayName = idx === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });

          const max = unit === 'metric' ? Math.round(day.tempMax) : Math.round(day.tempMax * 9/5 + 32);
          const min = unit === 'metric' ? Math.round(day.tempMin) : Math.round(day.tempMin * 9/5 + 32);
          
          const leftOffset = ((day.tempMin - minOfAll) / range) * 100;
          const barWidth = ((day.tempMax - day.tempMin) / range) * 100;

          return (
            <div key={idx} className={`flex items-center justify-between py-3 border-b last:border-0 px-2 group ${borderClass}`}>
              
              <div className="w-16 text-base font-medium">
                 {dayName}
              </div>
              
              <div className="flex flex-col items-center w-12">
                 <div className="w-8 h-8 opacity-90 filter drop-shadow-md">
                   <WeatherIcon code={day.iconCode} />
                 </div>
                 {day.precipitationProb !== undefined && day.precipitationProb > 20 && (
                    <span className="text-[10px] font-bold text-blue-400 mt-0.5">{day.precipitationProb}%</span>
                 )}
              </div>

              <div className="flex items-center flex-1 ml-4 gap-3">
                 <span className={`text-base font-medium w-8 text-right ${textSecondary}`}>{min}°</span>
                 
                 <div className={`flex-1 h-1.5 rounded-full overflow-hidden relative ${barBg}`}>
                    <div 
                      className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 via-green-400 to-orange-400 opacity-80"
                      style={{ left: `${leftOffset}%`, width: `${barWidth}%` }}
                    />
                 </div>

                 <span className="text-base font-medium w-8">{max}°</span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
