
import React from 'react';
import { HourlyForecast } from '../types';
import { WeatherIcon } from '../icons';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HourlyForecastStripProps {
  data: HourlyForecast[];
  unit: 'metric' | 'imperial';
  sunrise?: string;
  sunset?: string;
  theme: 'light' | 'dark';
}

export const HourlyForecastStrip: React.FC<HourlyForecastStripProps> = ({ data, unit, theme }) => {
  if (!data || data.length === 0) return null;
  const isDark = theme === 'dark';

  return (
    <Card className={`rounded-[2.5rem] backdrop-blur-2xl border bg-white/5 border-white/10 shadow-lg ${!isDark && 'bg-white/50 border-slate-200/80'}`}>
      <CardHeader className="pb-2">
        <CardTitle className={`flex items-center text-sm font-medium uppercase tracking-wider ${isDark ? 'opacity-70' : 'text-slate-600'}`}>
          <Clock className="w-4 h-4 mr-2" />
          Hourly Forecast
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide snap-x px-2">
          {data.slice(0, 24).map((hour, idx) => {
            const date = new Date(hour.time);
            const timeLabel = idx === 0 ? 'Now' : date.toLocaleTimeString([], { hour: 'numeric' });
            const temp = unit === 'metric' ? Math.round(hour.temp) : Math.round(hour.temp * 9/5 + 32);
            
            return (
              <div 
                key={idx} 
                className={`flex-none flex flex-col items-center justify-between h-32 snap-start group ${isDark ? 'text-white' : 'text-slate-800'}`}
              >
                {/* Time */}
                <span className={`text-sm font-medium ${isDark ? 'opacity-90' : 'text-slate-500'}`}>{timeLabel}</span>
                
                {/* Icon & Rain */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 my-1 opacity-100 filter drop-shadow-md">
                    <WeatherIcon code={hour.iconCode} />
                  </div>
                  {hour.precipProb > 20 && (
                    <span className="text-[11px] font-bold text-blue-400 mt-1">{Math.round(hour.precipProb)}%</span>
                  )}
                </div>
                
                {/* Temp */}
                <span className="text-xl font-medium tracking-tight">{temp}°</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
