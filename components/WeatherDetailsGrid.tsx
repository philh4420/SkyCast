import React from 'react';
import { WeatherData } from '../types';
import { Navigation } from 'lucide-react';
import { UtilityIcon } from '../icons';
import { SunDial } from './SunDial';

interface WeatherDetailsGridProps {
  data: WeatherData;
  unit: 'metric' | 'imperial';
  theme: 'light' | 'dark';
}

const getAQIInfo = (aqi: number) => {
  if (aqi <= 50) return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Good' };
  if (aqi <= 100) return { color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Moderate' };
  if (aqi <= 150) return { color: 'text-orange-400', bg: 'bg-orange-500/10', label: 'Sensitive' };
  if (aqi <= 200) return { color: 'text-red-400', bg: 'bg-red-500/10', label: 'Unhealthy' };
  return { color: 'text-purple-400', bg: 'bg-purple-500/10', label: 'Hazardous' };
};

const BentoBox = ({ title, icon, children, className = "", isDark }: any) => {
  const containerClass = isDark 
    ? 'bg-white/5 border-white/10 shadow-lg hover:bg-white/10 hover:border-white/15' 
    : 'bg-white/60 border-white/40 shadow-xl hover:bg-white/80 hover:border-white/60';
    
  const textPrimary = isDark ? 'text-white' : 'text-slate-800';
  const textSecondary = isDark ? 'opacity-70' : 'text-slate-500';

  return (
    <div className={`group relative ${containerClass} border rounded-3xl p-5 flex flex-col backdrop-blur-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ease-out aspect-square overflow-hidden ${className} ${textPrimary}`}>
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className={`flex items-center gap-2 mb-3 group-hover:opacity-90 transition-opacity duration-300 relative z-10 ${textSecondary}`}>
        <div className="w-4 h-4 drop-shadow-sm">
          {icon}
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider drop-shadow-sm">{title}</span>
      </div>
      
      <div className="flex-1 flex flex-col justify-between relative z-10">
        {children}
      </div>
    </div>
  );
};

export const WeatherDetailsGrid: React.FC<WeatherDetailsGridProps> = ({ data, unit, theme }) => {
  const { current, forecast } = data;
  const isDark = theme === 'dark';
  const textSecondary = isDark ? 'opacity-70' : 'text-slate-500';
  
  // Basic Values
  const temp = Math.round(current.temp);
  const feelsLike = Math.round(current.feelsLike);
  const gust = current.windGust ? Math.round(current.windGust) : null;

  // Grid Stats Values
  const isMetric = unit === 'metric';
  const windSpeedVal = isMetric ? Math.round(current.windSpeed) : Math.round(current.windSpeed * 0.62);
  const windUnit = isMetric ? 'km/h' : 'mph';
  const visVal = current.visibility ? (isMetric ? Math.round(current.visibility) : Math.round(current.visibility * 0.62)) : '-';
  const visUnit = isMetric ? 'km' : 'mi';
  const dewPointVal = current.dewPoint !== undefined ? (isMetric ? Math.round(current.dewPoint) : Math.round(current.dewPoint * 9/5 + 32)) : '-';
  const rainChance = forecast[0]?.precipitationProb ?? 0;

  const getUVDesc = (uv: number) => {
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 w-full">
        
        {/* Sun Dial - New Component */}
        <BentoBox title="Sun & Moon" icon={<UtilityIcon type="sunrise" />} isDark={isDark} className="col-span-2 md:col-span-1 xl:col-span-2 2xl:col-span-2">
          {current.sunrise && current.sunset && current.moonrise && current.moonset && (
            <SunDial 
              sunrise={current.sunrise}
              sunset={current.sunset}
              moonrise={current.moonrise}
              moonset={current.moonset}
              isDark={isDark} 
            />
          )}
        </BentoBox>

        {/* UV Index */}
        <BentoBox title="UV Index" icon={<UtilityIcon type="uv" />} isDark={isDark}>
          <div>
            <div className="text-3xl font-medium">{current.uvIndex ?? 0}</div>
            <div className="text-sm font-medium">{getUVDesc(current.uvIndex ?? 0)}</div>
          </div>
          <div className="mt-2">
            <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-purple-500 relative">
              <div className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-sm ${isDark ? 'border-black/50' : 'border-slate-300'}`} style={{ left: `${Math.min(((current.uvIndex ?? 0) / 11) * 100, 100)}%` }} />
            </div>
          </div>
        </BentoBox>

        {/* Wind */}
        <BentoBox title="Wind" icon={<UtilityIcon type="wind" />} isDark={isDark}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-medium">{windSpeedVal}</div>
              <div className={`text-xs font-medium ${textSecondary}`}>{windUnit}</div>
            </div>
            <div className="relative w-10 h-10 flex items-center justify-center">
               <Navigation className={`w-8 h-8 ${isDark ? 'opacity-80' : 'text-slate-600'}`} style={{ transform: `rotate(${current.windDir || 0}deg)` }} />
            </div>
          </div>
          {gust && <div className={`text-xs mt-1 ${textSecondary}`}>Gusts: {gust}</div>}
        </BentoBox>

        {/* Rainfall */}
        <BentoBox title="Rainfall" icon={<UtilityIcon type="rain" />} isDark={isDark}>
          <div className="text-3xl font-medium">{rainChance}%</div>
          <div className={`text-xs ${textSecondary}`}>
            {forecast[0]?.totalPrecip !== undefined ? `${forecast[0].totalPrecip} mm expected` : 'Chance of rain'}
          </div>
        </BentoBox>

        {/* Feels Like */}
        <BentoBox title="Feels Like" icon={<UtilityIcon type="feels-like" />} isDark={isDark}>
          <div className="text-3xl font-medium">{feelsLike}°</div>
          <div className={`text-xs ${textSecondary}`}>
            {feelsLike > temp ? 'Humid' : feelsLike < temp ? 'Wind Chill' : 'Actual'}
          </div>
        </BentoBox>

        {/* Humidity */}
        <BentoBox title="Humidity" icon={<UtilityIcon type="humidity" />} isDark={isDark}>
          <div className="text-3xl font-medium">{current.humidity}%</div>
          <div className={`text-xs ${textSecondary}`}>Dew Point: {dewPointVal}°</div>
        </BentoBox>

        {/* Visibility */}
        <BentoBox title="Visibility" icon={<UtilityIcon type="visibility" />} isDark={isDark}>
          <div className="text-3xl font-medium">{visVal}</div>
          <div className={`text-xs ${textSecondary}`}>{visUnit}</div>
        </BentoBox>

        {/* Pressure */}
        <BentoBox title="Pressure" icon={<UtilityIcon type="pressure" />} isDark={isDark}>
          <div className="text-3xl font-medium">{current.pressure}</div>
          <div className={`text-xs ${textSecondary}`}>hPa</div>
        </BentoBox>
    </div>
  );
};
