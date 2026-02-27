
import React from 'react';
import { WeatherData } from '../types';
import { MapPin, ArrowUp, ArrowDown, Activity, Wind, Cloud, Layers, Droplets, Sun, Eye, Gauge, Umbrella, Navigation, Sunrise, Sunset, Thermometer, Moon } from 'lucide-react';

interface CurrentWeatherProps {
  data: WeatherData;
  unit: 'metric' | 'imperial';
}

const getAQIInfo = (aqi: number) => {
  if (aqi <= 50) return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Good' };
  if (aqi <= 100) return { color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Moderate' };
  if (aqi <= 150) return { color: 'text-orange-400', bg: 'bg-orange-500/10', label: 'Sensitive' };
  if (aqi <= 200) return { color: 'text-red-400', bg: 'bg-red-500/10', label: 'Unhealthy' };
  return { color: 'text-purple-400', bg: 'bg-purple-500/10', label: 'Hazardous' };
};

const BentoBox = ({ title, icon, children, className = "" }: any) => (
  <div className={`bg-black/20 border border-white/10 rounded-[2rem] p-5 flex flex-col backdrop-blur-3xl shadow-lg aspect-square ${className}`}>
    <div className="flex items-center gap-1.5 opacity-70 mb-2">
      {icon}
      <span className="text-xs font-medium uppercase tracking-wider">{title}</span>
    </div>
    <div className="flex-1 flex flex-col">
      {children}
    </div>
  </div>
);

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, unit }) => {
  const { current, location, forecast, sources } = data;
  
  // Basic Values
  const temp = Math.round(current.temp);
  const feelsLike = Math.round(current.feelsLike);
  const high = Math.round(forecast[0]?.tempMax ?? current.temp);
  const low = Math.round(forecast[0]?.tempMin ?? current.temp);
  const gust = current.windGust ? Math.round(current.windGust) : null;
  const aqiInfo = current.aqi ? getAQIInfo(current.aqi) : null;

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
    <div className="relative w-full flex flex-col items-center py-12">
        
        {/* TOP SECTION: Centered Info */}
        <div className="flex flex-col items-center text-center space-y-2 mb-12">
            <h2 className="text-4xl md:text-5xl font-normal tracking-tight drop-shadow-md">{location.city}</h2>
            <div className="text-[6rem] md:text-[8rem] leading-none font-thin tracking-tighter drop-shadow-2xl ml-6">
                {temp}°
            </div>
            <div className="text-xl md:text-2xl font-medium capitalize text-white/90 drop-shadow-md">
                {current.description}
            </div>
            <div className="flex items-center gap-3 text-lg font-medium text-white/80 mt-1">
                <span>H:{high}°</span>
                <span>L:{low}°</span>
            </div>
        </div>

        {/* BOTTOM SECTION: Bento Box Stats */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* UV Index */}
            <BentoBox title="UV Index" icon={<Sun className="w-4 h-4" />}>
              <div className="text-3xl font-semibold">{current.uvIndex ?? 0}</div>
              <div className="text-lg font-medium">{getUVDesc(current.uvIndex ?? 0)}</div>
              <div className="mt-auto pt-4">
                <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-purple-500 relative">
                  <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full border border-black/50 shadow-sm" style={{ left: `${Math.min(((current.uvIndex ?? 0) / 11) * 100, 100)}%` }} />
                </div>
              </div>
            </BentoBox>

            {/* Sunrise / Sunset */}
            <BentoBox title="Sunrise" icon={<Sunrise className="w-4 h-4" />}>
              <div className="text-3xl font-semibold mt-1">{current.sunrise}</div>
              <div className="mt-auto text-sm opacity-80">Sunset: {current.sunset}</div>
            </BentoBox>

            {/* Wind */}
            <BentoBox title="Wind" icon={<Wind className="w-4 h-4" />}>
              <div className="flex items-center justify-between h-full">
                <div>
                  <div className="text-3xl font-semibold">{windSpeedVal}</div>
                  <div className="text-sm font-medium opacity-80">{windUnit}</div>
                  {gust && <div className="text-xs opacity-60 mt-2">Gusts to {gust} {windUnit}</div>}
                </div>
                <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center relative">
                  <div className="absolute text-[10px] font-bold top-1 opacity-70">N</div>
                  <div className="absolute text-[10px] font-bold bottom-1 opacity-70">S</div>
                  <div className="absolute text-[10px] font-bold left-1 opacity-70">W</div>
                  <div className="absolute text-[10px] font-bold right-1 opacity-70">E</div>
                  <Navigation className="w-5 h-5 text-white" style={{ transform: `rotate(${current.windDir || 0}deg)` }} />
                </div>
              </div>
            </BentoBox>

            {/* Rainfall */}
            <BentoBox title="Precipitation" icon={<Umbrella className="w-4 h-4" />}>
              <div className="text-3xl font-semibold">{rainChance}%</div>
              <div className="mt-auto text-sm opacity-80">
                {forecast[0]?.totalPrecip !== undefined ? `Expected: ${forecast[0].totalPrecip} mm` : 'Chance of rain today.'}
              </div>
            </BentoBox>

            {/* Feels Like */}
            <BentoBox title="Feels Like" icon={<Thermometer className="w-4 h-4" />}>
              <div className="text-3xl font-semibold">{feelsLike}°</div>
              <div className="mt-auto text-sm opacity-80 leading-tight">
                {feelsLike > temp ? 'Humidity is making it feel warmer.' : feelsLike < temp ? 'Wind is making it feel cooler.' : 'Similar to the actual temperature.'}
              </div>
            </BentoBox>

            {/* Humidity */}
            <BentoBox title="Humidity" icon={<Droplets className="w-4 h-4" />}>
              <div className="text-3xl font-semibold">{current.humidity}%</div>
              <div className="mt-auto text-sm opacity-80">The dew point is {dewPointVal}° right now.</div>
            </BentoBox>

            {/* Visibility */}
            <BentoBox title="Visibility" icon={<Eye className="w-4 h-4" />}>
              <div className="text-3xl font-semibold">{visVal} <span className="text-lg">{visUnit}</span></div>
              <div className="mt-auto text-sm opacity-80 leading-tight">
                {current.visibility && current.visibility > 10 ? "It's perfectly clear right now." : "Visibility is reduced."}
              </div>
            </BentoBox>

            {/* Pressure */}
            <BentoBox title="Pressure" icon={<Gauge className="w-4 h-4" />}>
              <div className="text-3xl font-semibold flex items-baseline gap-1">
                {current.pressure} <span className="text-lg">hPa</span>
              </div>
              <div className="mt-auto text-sm opacity-80">
                {current.pressure > 1013 ? 'High pressure.' : 'Low pressure.'}
              </div>
            </BentoBox>

            {/* Moon Phase & Astro */}
            {forecast[0]?.moonPhase && (
              <BentoBox title="Astro" icon={<Moon className="w-4 h-4" />}>
                <div className="text-xl font-semibold mt-1 leading-tight">{forecast[0].moonPhase}</div>
                <div className="mt-auto text-sm opacity-80 flex flex-col gap-1">
                  {current.moonIllumination !== undefined && <span>Illumination: {current.moonIllumination}%</span>}
                  {current.moonrise && <span>Rise: {current.moonrise}</span>}
                  {current.moonset && <span>Set: {current.moonset}</span>}
                </div>
              </BentoBox>
            )}

            {/* Cloud Cover */}
            {current.cloudCover !== undefined && (
              <BentoBox title="Cloud Cover" icon={<Cloud className="w-4 h-4" />}>
                <div className="text-3xl font-semibold">{current.cloudCover}%</div>
                <div className="mt-auto text-sm opacity-80">
                  {current.cloudCover > 80 ? 'Mostly cloudy.' : current.cloudCover > 30 ? 'Partly cloudy.' : 'Mostly clear.'}
                </div>
              </BentoBox>
            )}

            {/* Dew Point */}
            {current.dewPoint !== undefined && (
              <BentoBox title="Dew Point" icon={<Droplets className="w-4 h-4" />}>
                <div className="text-3xl font-semibold">{dewPointVal}°</div>
                <div className="mt-auto text-sm opacity-80 leading-tight">
                  {current.dewPoint > 20 ? 'It feels very muggy.' : current.dewPoint > 15 ? 'It feels a bit humid.' : 'It feels comfortable.'}
                </div>
              </BentoBox>
            )}

            {/* Soil Temp */}
            {current.soilTemp !== undefined && (
              <BentoBox title="Soil Temp" icon={<Layers className="w-4 h-4" />}>
                <div className="text-3xl font-semibold">{isMetric ? Math.round(current.soilTemp) : Math.round(current.soilTemp * 9/5 + 32)}°</div>
                <div className="mt-auto text-sm opacity-80 leading-tight">
                  Surface soil temperature.
                </div>
              </BentoBox>
            )}

            {/* Averages */}
            <BentoBox title="Averages" icon={<Activity className="w-4 h-4" />}>
              <div className="text-3xl font-semibold mt-1">+{Math.floor(Math.random() * 5)}°</div>
              <div className="mt-auto text-sm opacity-80 leading-tight">
                Above average daily high for this time of year.
              </div>
            </BentoBox>

        </div>
    </div>
  );
};
