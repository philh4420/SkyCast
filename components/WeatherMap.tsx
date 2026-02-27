import React, { useState } from 'react';
import { Map, Wind, Droplets, Thermometer, Cloud, Radio } from 'lucide-react';

interface WeatherMapProps {
  lat: number;
  lon: number;
  unit: 'metric' | 'imperial';
}

type OverlayType = 'rain' | 'wind' | 'temp' | 'clouds' | 'radar';

export const WeatherMap: React.FC<WeatherMapProps> = ({ lat, lon, unit }) => {
  const [overlay, setOverlay] = useState<OverlayType>('rain');

  const overlays = [
    { id: 'radar', name: 'Radar', icon: <Radio className="w-4 h-4" /> },
    { id: 'rain', name: 'Precipitation', icon: <Droplets className="w-4 h-4" /> },
    { id: 'wind', name: 'Wind', icon: <Wind className="w-4 h-4" /> },
    { id: 'temp', name: 'Temperature', icon: <Thermometer className="w-4 h-4" /> },
    { id: 'clouds', name: 'Clouds', icon: <Cloud className="w-4 h-4" /> },
  ];

  const metricTemp = unit === 'metric' ? '°C' : '°F';
  const metricWind = unit === 'metric' ? 'km/h' : 'mph';

  return (
    <div className="bg-black/20 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden relative h-[600px] shadow-2xl flex flex-col group">
      {/* Header & Controls */}
      <div className="absolute top-0 left-0 w-full p-6 z-10 pointer-events-none flex flex-col gap-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent pb-12 transition-opacity">
        <div className="flex items-center opacity-90">
          <Map className="w-4 h-4 mr-2" />
          <h3 className="text-sm font-medium uppercase tracking-wider">Interactive Weather Map</h3>
        </div>
        
        {/* Layer Switcher */}
        <div className="flex flex-wrap gap-2 pointer-events-auto">
          {overlays.map((layer) => (
            <button
              key={layer.id}
              onClick={() => setOverlay(layer.id as OverlayType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all backdrop-blur-md border ${
                overlay === layer.id 
                  ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)]' 
                  : 'bg-black/50 text-white/80 border-white/10 hover:bg-white/20 hover:text-white'
              }`}
            >
              {layer.icon}
              {layer.name}
            </button>
          ))}
        </div>
      </div>

      {/* Map Iframe */}
      <div className="flex-1 w-full bg-slate-900 relative">
        {/* Loading skeleton behind iframe */}
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
            <Map className="w-12 h-12 text-white/20" />
        </div>
        <iframe 
          width="100%" 
          height="100%" 
          src={`https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=${metricTemp}&metricWind=${metricWind}&zoom=5&overlay=${overlay}&product=ecmwf&level=surface&lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&marker=true&detail=true&message=true`}
          frameBorder="0"
          title="Interactive Weather Map"
          className="w-full h-full grayscale-[0.1] contrast-125 relative z-10"
        ></iframe>
      </div>
    </div>
  );
};
