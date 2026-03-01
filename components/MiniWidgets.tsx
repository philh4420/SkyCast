import React from 'react';
import { WeatherData } from '../types';
import { UtilityIcon } from '../icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Mountain, Droplets } from 'lucide-react';

interface BaseWidgetProps {
  data: WeatherData;
  unit: 'metric' | 'imperial';
  theme: 'light' | 'dark';
}

const DetailCard = ({ title, icon, children, isDark }: any) => (
  <Card className={`h-full flex flex-col rounded-[2rem] backdrop-blur-2xl bg-white/5 border-white/10 shadow-lg hover:bg-white/10 transition-colors ${!isDark && 'bg-white/50 border-slate-200/80 hover:bg-white/70'}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className={`text-sm font-medium ${isDark ? 'text-white/70' : 'text-slate-500'}`}>{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent className="flex-1 flex flex-col justify-center">
      {children}
    </CardContent>
  </Card>
);

export const RainfallWidget: React.FC<BaseWidgetProps> = ({ data, unit, theme }) => {
  const isDark = theme === 'dark';
  const isMetric = unit === 'metric';
  const rainChance = data.forecast[0]?.precipitationProb ?? 0;
  const precipVal = data.forecast[0]?.totalPrecip ?? 0;
  const displayPrecip = isMetric ? precipVal : (precipVal / 25.4).toFixed(2);
  const precipUnit = isMetric ? 'mm' : 'in';

  return (
    <DetailCard title="Rainfall" icon={<UtilityIcon type="rain" />} isDark={isDark}>
      <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{rainChance}%</div>
      <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>{displayPrecip} {precipUnit} expected</p>
    </DetailCard>
  );
};

export const FeelsLikeWidget: React.FC<BaseWidgetProps> = ({ data, unit, theme }) => {
  const isDark = theme === 'dark';
  const isMetric = unit === 'metric';
  const temp = isMetric ? Math.round(data.current.temp) : Math.round(data.current.temp * 9/5 + 32);
  const feelsLike = isMetric ? Math.round(data.current.feelsLike) : Math.round(data.current.feelsLike * 9/5 + 32);

  return (
    <DetailCard title="Feels Like" icon={<UtilityIcon type="feels-like" />} isDark={isDark}>
      <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{feelsLike}°</div>
      <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>{feelsLike > temp ? 'Humid' : feelsLike < temp ? 'Wind Chill' : 'Actual'}</p>
    </DetailCard>
  );
};

export const HumidityWidget: React.FC<BaseWidgetProps> = ({ data, unit, theme }) => {
  const isDark = theme === 'dark';
  const isMetric = unit === 'metric';
  const dewPointVal = data.current.dewPoint !== undefined ? (isMetric ? Math.round(data.current.dewPoint) : Math.round(data.current.dewPoint * 9/5 + 32)) : '-';

  return (
    <DetailCard title="Humidity" icon={<UtilityIcon type="humidity" />} isDark={isDark}>
      <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{data.current.humidity}%</div>
      <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>Dew Point: {dewPointVal}°</p>
    </DetailCard>
  );
};

export const VisibilityWidget: React.FC<BaseWidgetProps> = ({ data, unit, theme }) => {
  const isDark = theme === 'dark';
  const isMetric = unit === 'metric';
  const visVal = data.current.visibility ? (isMetric ? Math.round(data.current.visibility) : Math.round(data.current.visibility * 0.62)) : '-';
  const visUnit = isMetric ? 'km' : 'mi';

  return (
    <DetailCard title="Visibility" icon={<UtilityIcon type="visibility" />} isDark={isDark}>
      <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{visVal} {visUnit}</div>
    </DetailCard>
  );
};

export const PressureWidget: React.FC<BaseWidgetProps> = ({ data, theme }) => {
  const isDark = theme === 'dark';

  return (
    <DetailCard title="Pressure" icon={<UtilityIcon type="pressure" />} isDark={isDark}>
      <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{data.current.pressure} hPa</div>
    </DetailCard>
  );
};

export const SimpleUVWidget: React.FC<BaseWidgetProps> = ({ data, theme }) => {
  const isDark = theme === 'dark';
  const uv = data.current.uvIndex ?? 0;
  const getUVDesc = (val: number) => {
    if (val <= 2) return 'Low';
    if (val <= 5) return 'Moderate';
    if (val <= 7) return 'High';
    if (val <= 10) return 'Very High';
    return 'Extreme';
  };

  return (
    <DetailCard title="UV Index" icon={<UtilityIcon type="uv" />} isDark={isDark}>
      <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{uv}</div>
      <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>{getUVDesc(uv)}</p>
    </DetailCard>
  );
};

export const SimpleWindWidget: React.FC<BaseWidgetProps> = ({ data, unit, theme }) => {
  const isDark = theme === 'dark';
  const isMetric = unit === 'metric';
  const windSpeedVal = isMetric ? Math.round(data.current.windSpeed) : Math.round(data.current.windSpeed * 0.62);
  const windUnit = isMetric ? 'km/h' : 'mph';
  const gust = data.current.windGust ? (isMetric ? Math.round(data.current.windGust) : Math.round(data.current.windGust * 0.62)) : null;

  return (
    <DetailCard title="Wind" icon={<UtilityIcon type="wind" />} isDark={isDark}>
      <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{windSpeedVal} {windUnit}</div>
      {gust && <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>Gusts: {gust}</p>}
    </DetailCard>
  );
};

export const CloudCoverWidget: React.FC<BaseWidgetProps> = ({ data, theme }) => {
  const isDark = theme === 'dark';
  const cover = data.current.cloudCover ?? 0;

  return (
    <DetailCard title="Cloud Cover" icon={<Cloud className="w-4 h-4 text-slate-400" />} isDark={isDark}>
      <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{cover}%</div>
      <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>Sky coverage</p>
    </DetailCard>
  );
};

export const SoilTempWidget: React.FC<BaseWidgetProps> = ({ data, unit, theme }) => {
  const isDark = theme === 'dark';
  const isMetric = unit === 'metric';
  if (data.current.soilTemp === undefined) return null;
  const temp = isMetric ? Math.round(data.current.soilTemp) : Math.round(data.current.soilTemp * 9/5 + 32);

  return (
    <DetailCard title="Soil Temp" icon={<Mountain className="w-4 h-4 text-amber-600" />} isDark={isDark}>
      <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{temp}°</div>
      <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>At 0cm depth</p>
    </DetailCard>
  );
};

export const DewPointWidget: React.FC<BaseWidgetProps> = ({ data, unit, theme }) => {
  const isDark = theme === 'dark';
  const isMetric = unit === 'metric';
  if (data.current.dewPoint === undefined) return null;
  const temp = isMetric ? Math.round(data.current.dewPoint) : Math.round(data.current.dewPoint * 9/5 + 32);

  return (
    <DetailCard title="Dew Point" icon={<Droplets className="w-4 h-4 text-blue-400" />} isDark={isDark}>
      <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{temp}°</div>
      <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>Moisture level</p>
    </DetailCard>
  );
};
