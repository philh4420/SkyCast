import React from 'react';
import { WeatherData } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wind, Navigation } from 'lucide-react';
import { motion } from 'motion/react';

interface WindCompassWidgetProps {
  data: WeatherData;
  unit: 'metric' | 'imperial';
  theme: 'light' | 'dark';
}

export const WindCompassWidget: React.FC<WindCompassWidgetProps> = ({ data, unit, theme }) => {
  const isDark = theme === 'dark';
  const { current } = data;

  if (current.windSpeed === undefined || current.windDir === undefined) return null;

  const speed = unit === 'metric' ? current.windSpeed : current.windSpeed * 0.621371;
  const gust = current.windGust ? (unit === 'metric' ? current.windGust : current.windGust * 0.621371) : undefined;
  const unitLabel = unit === 'metric' ? 'km/h' : 'mph';

  const getDirectionLabel = (deg: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round((deg % 360) / 22.5);
    return directions[index % 16];
  };

  const getWindDescription = (s: number) => {
    if (s < 5) return 'Calm';
    if (s < 20) return 'Light Breeze';
    if (s < 40) return 'Moderate Breeze';
    if (s < 60) return 'Strong Wind';
    if (s < 90) return 'Gale';
    return 'Storm';
  };

  return (
    <Card className={`h-full flex flex-col rounded-[2.5rem] overflow-hidden backdrop-blur-3xl border transition-all duration-500 ${isDark ? 'bg-white/5 border-white/10 shadow-2xl' : 'bg-white/60 border-slate-200 shadow-xl'}`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
          <Wind className="w-3.5 h-3.5 mr-2" />
          Wind & Gusts
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col items-center justify-center pt-4 pb-6 gap-6">
        
        {/* Compass Visualization */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Compass Ring */}
          <div className={`absolute inset-0 rounded-full border-4 ${isDark ? 'border-white/10' : 'border-slate-200'}`}></div>
          
          {/* Cardinal Points */}
          <span className={`absolute top-1 text-[10px] font-bold ${isDark ? 'text-white/50' : 'text-slate-400'}`}>N</span>
          <span className={`absolute bottom-1 text-[10px] font-bold ${isDark ? 'text-white/50' : 'text-slate-400'}`}>S</span>
          <span className={`absolute right-2 text-[10px] font-bold ${isDark ? 'text-white/50' : 'text-slate-400'}`}>E</span>
          <span className={`absolute left-2 text-[10px] font-bold ${isDark ? 'text-white/50' : 'text-slate-400'}`}>W</span>
          
          {/* Inner Circle */}
          <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-inner ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
            <span className="text-2xl font-black tracking-tighter">{Math.round(speed)}</span>
            <span className="text-[9px] font-bold uppercase tracking-widest opacity-50">{unitLabel}</span>
          </div>

          {/* Direction Needle */}
          <motion.div 
            className="absolute inset-0 flex items-start justify-center"
            initial={{ rotate: 0 }}
            animate={{ rotate: current.windDir }}
            transition={{ type: "spring", stiffness: 50, damping: 10 }}
          >
            <div className={`w-1 h-12 rounded-full mt-1 ${isDark ? 'bg-blue-400' : 'bg-blue-500'} shadow-[0_0_10px_rgba(59,130,246,0.5)] relative`}>
              <div className={`absolute -top-2 -left-1.5 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] ${isDark ? 'border-b-blue-400' : 'border-b-blue-500'}`}></div>
            </div>
          </motion.div>
        </div>

        {/* Details */}
        <div className="flex flex-col items-center gap-1">
          <div className="text-lg font-black tracking-tight">{getWindDescription(speed)}</div>
          <div className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
            From {getDirectionLabel(current.windDir)}
          </div>
        </div>

        {/* Gusts */}
        {gust !== undefined && (
          <div className={`w-full mt-2 pt-4 border-t flex items-center justify-between px-4 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
             <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-teal-500/20 text-teal-300' : 'bg-teal-100 text-teal-600'}`}>
                  <Wind className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Peak Gusts</span>
                  <span className={`text-[10px] uppercase tracking-wider font-semibold ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                    Up to {Math.round(gust)} {unitLabel}
                  </span>
                </div>
             </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
};
