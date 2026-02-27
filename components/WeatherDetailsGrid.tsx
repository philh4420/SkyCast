import React from 'react';
import { WeatherData } from '../types';
import { UtilityIcon } from '../icons';
import { SunDial } from './SunDial';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

const DetailCard = ({ title, icon, children, className = "", isDark }: any) => (
  <Card className={`backdrop-blur-2xl bg-white/5 border-white/10 shadow-lg hover:bg-white/10 transition-colors ${!isDark && 'bg-white/50 border-slate-200/80 hover:bg-white/70'} ${className}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className={`text-sm font-medium ${isDark ? 'text-white/70' : 'text-slate-500'}`}>{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);

export const WeatherDetailsGrid: React.FC<WeatherDetailsGridProps> = ({ data, unit, theme }) => {
  const { current, forecast } = data;
  const isDark = theme === 'dark';
  
  // Basic Values
  const isMetric = unit === 'metric';
  const convertTemp = (c: number) => isMetric ? Math.round(c) : Math.round(c * 9/5 + 32);

  const temp = convertTemp(current.temp);
  const feelsLike = convertTemp(current.feelsLike);
  const gust = current.windGust ? (isMetric ? Math.round(current.windGust) : Math.round(current.windGust * 0.62)) : null;
  const windSpeedVal = isMetric ? Math.round(current.windSpeed) : Math.round(current.windSpeed * 0.62);
  const windUnit = isMetric ? 'km/h' : 'mph';
  const visVal = current.visibility ? (isMetric ? Math.round(current.visibility) : Math.round(current.visibility * 0.62)) : '-';
  const visUnit = isMetric ? 'km' : 'mi';
  const dewPointVal = current.dewPoint !== undefined ? (isMetric ? Math.round(current.dewPoint) : Math.round(current.dewPoint * 9/5 + 32)) : '-';
  const rainChance = forecast[0]?.precipitationProb ?? 0;
  const precipVal = forecast[0]?.totalPrecip ?? 0;
  const displayPrecip = isMetric ? precipVal : (precipVal / 25.4).toFixed(2);
  const precipUnit = isMetric ? 'mm' : 'in';

  const getUVDesc = (uv: number) => {
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
  };

  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-white/50' : 'text-slate-500';

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 w-full">
        
        <div className="col-span-2 md:col-span-1 xl:col-span-2 2xl:col-span-2">
          {current.sunrise && current.sunset && current.moonrise && current.moonset && (
            <SunDial 
              sunrise={current.sunrise}
              sunset={current.sunset}
              moonrise={current.moonrise}
              moonset={current.moonset}
              isDark={isDark} 
            />
          )}
        </div>

        <DetailCard title="UV Index" icon={<UtilityIcon type="uv" />} isDark={isDark}>
          <div>
            <div className={`text-2xl font-bold ${textPrimary}`}>{current.uvIndex ?? 0}</div>
            <p className={`text-xs ${textSecondary}`}>{getUVDesc(current.uvIndex ?? 0)}</p>
          </div>
        </DetailCard>

        <DetailCard title="Wind" icon={<UtilityIcon type="wind" />} isDark={isDark}>
          <div className={`text-2xl font-bold ${textPrimary}`}>{windSpeedVal} {windUnit}</div>
          {gust && <p className={`text-xs ${textSecondary}`}>Gusts: {gust}</p>}
        </DetailCard>

        <DetailCard title="Rainfall" icon={<UtilityIcon type="rain" />} isDark={isDark}>
          <div className={`text-2xl font-bold ${textPrimary}`}>{rainChance}%</div>
          <p className={`text-xs ${textSecondary}`}>{displayPrecip} {precipUnit} expected</p>
        </DetailCard>

        <DetailCard title="Feels Like" icon={<UtilityIcon type="feels-like" />} isDark={isDark}>
          <div className={`text-2xl font-bold ${textPrimary}`}>{feelsLike}°</div>
          <p className={`text-xs ${textSecondary}`}>{feelsLike > temp ? 'Humid' : feelsLike < temp ? 'Wind Chill' : 'Actual'}</p>
        </DetailCard>

        <DetailCard title="Humidity" icon={<UtilityIcon type="humidity" />} isDark={isDark}>
          <div className={`text-2xl font-bold ${textPrimary}`}>{current.humidity}%</div>
          <p className={`text-xs ${textSecondary}`}>Dew Point: {dewPointVal}°</p>
        </DetailCard>

        <DetailCard title="Visibility" icon={<UtilityIcon type="visibility" />} isDark={isDark}>
          <div className={`text-2xl font-bold ${textPrimary}`}>{visVal} {visUnit}</div>
        </DetailCard>

        <DetailCard title="Pressure" icon={<UtilityIcon type="pressure" />} isDark={isDark}>
          <div className={`text-2xl font-bold ${textPrimary}`}>{current.pressure} hPa</div>
        </DetailCard>
    </div>
  );
};

