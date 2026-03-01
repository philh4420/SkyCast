import React from 'react';
import { WeatherData } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Droplets } from 'lucide-react';

interface ComfortWidgetProps {
  data: WeatherData;
  unit: 'metric' | 'imperial';
  theme: 'light' | 'dark';
}

export const ComfortWidget: React.FC<ComfortWidgetProps> = ({ data, unit, theme }) => {
  const isDark = theme === 'dark';
  const { temp, feelsLike, humidity, dewPoint } = data.current;
  
  const isMetric = unit === 'metric';
  const convert = (c: number) => isMetric ? Math.round(c) : Math.round(c * 9/5 + 32);
  
  const displayTemp = convert(temp);
  const displayFeelsLike = convert(feelsLike);
  const displayDewPoint = dewPoint !== undefined ? convert(dewPoint) : undefined;
  
  const diff = displayFeelsLike - displayTemp;
  let diffText = "Feels same as actual";
  if (diff > 0) diffText = `Feels ${diff}° warmer`;
  if (diff < 0) diffText = `Feels ${Math.abs(diff)}° cooler`;

  let humidityLabel = "Comfortable";
  if (humidity < 30) humidityLabel = "Dry";
  else if (humidity > 60) humidityLabel = "Muggy";
  else if (humidity > 70) humidityLabel = "Oppressive";

  return (
    <Card className={`h-full flex flex-col rounded-[2.5rem] overflow-hidden backdrop-blur-3xl border transition-all duration-500 ${isDark ? 'bg-white/5 border-white/10 shadow-2xl' : 'bg-white/60 border-slate-200 shadow-xl'}`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
          <Thermometer className="w-3.5 h-3.5 mr-2" />
          Comfort Level
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-6 pt-4 pb-6 justify-center">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className={`text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Feels Like</span>
            <span className={`text-4xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>{displayFeelsLike}°</span>
          </div>
          <div className={`text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-2xl ${isDark ? 'bg-white/10 text-white/70' : 'bg-slate-100 text-slate-600'}`}>
            {diffText}
          </div>
        </div>

        <div className={`w-full h-px ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className={`text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Humidity</span>
            <span className={`text-3xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>{humidity}%</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5">
              <Droplets className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
              <span className={`text-sm font-bold ${isDark ? 'text-white/90' : 'text-slate-700'}`}>{humidityLabel}</span>
            </div>
            {displayDewPoint !== undefined && (
              <span className={`text-[10px] font-medium ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                Dew Point: {displayDewPoint}°
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
