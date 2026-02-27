
import React from 'react';
import { WeatherData } from '../types';

interface CurrentWeatherProps {
  data: WeatherData;
  unit: 'metric' | 'imperial';
  theme: 'light' | 'dark';
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, unit, theme }) => {
  const { current, location, forecast } = data;
  const isDark = theme === 'dark';
  
  const temp = Math.round(current.temp);
  const high = Math.round(forecast[0]?.tempMax ?? current.temp);
  const low = Math.round(forecast[0]?.tempMin ?? current.temp);

  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const subTextColor = isDark ? 'text-white/70' : 'text-slate-600';
  const tempGradient = isDark 
    ? 'from-white to-white/60' 
    : 'from-slate-800 to-slate-900';

  return (
    <div className="flex flex-col items-center justify-center text-center py-8 md:py-12 relative z-10">
        <h2 className={`text-4xl md:text-5xl font-serif tracking-tight drop-shadow-lg mb-4 ${textColor}`}>
          {location.city}
        </h2>
        
        <div className="relative flex items-center justify-center -my-4">
            <span className={`text-[9rem] md:text-[12rem] leading-none font-light tracking-tighter text-transparent bg-clip-text bg-gradient-to-b ${tempGradient} drop-shadow-2xl select-none`}>
                {temp}°
            </span>
        </div>
        
        <div className={`text-xl md:text-2xl font-medium capitalize drop-shadow-md tracking-wide ${textColor}`}>
            {current.description}
        </div>
        
        <div className={`flex items-center gap-6 text-lg md:text-xl font-medium mt-3 tracking-wider ${subTextColor}`}>
            <span className="drop-shadow-sm">H:{high}°</span>
            <span className="drop-shadow-sm">L:{low}°</span>
        </div>
    </div>
  );
};
