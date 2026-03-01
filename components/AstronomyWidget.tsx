import React from 'react';
import { WeatherData } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sunrise, Sunset, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';

interface AstronomyWidgetProps {
  data: WeatherData;
  theme: 'light' | 'dark';
}

export const AstronomyWidget: React.FC<AstronomyWidgetProps> = ({ data, theme }) => {
  const isDark = theme === 'dark';
  const { current } = data;

  if (!current.sunrise || !current.sunset) return null;

  // Calculate sun progress
  const now = new Date();
  
  // Parse sunrise/sunset times (assuming format like "06:30 AM" or "06:30")
  const parseTime = (timeStr: string) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  let sunriseTime = now;
  let sunsetTime = now;
  
  try {
    sunriseTime = parseTime(current.sunrise);
    sunsetTime = parseTime(current.sunset);
  } catch (e) {
    // fallback if parsing fails
  }

  const totalDaylight = sunsetTime.getTime() - sunriseTime.getTime();
  const elapsedDaylight = now.getTime() - sunriseTime.getTime();
  let progress = Math.max(0, Math.min(1, elapsedDaylight / totalDaylight));
  
  // If it's night time, progress is either 0 or 1
  if (now < sunriseTime) progress = 0;
  if (now > sunsetTime) progress = 1;

  // Calculate arc position
  const radius = 100;
  const arcAngle = Math.PI; // Half circle
  const currentAngle = Math.PI - (progress * arcAngle);
  
  const sunX = 120 + radius * Math.cos(currentAngle);
  const sunY = 110 - radius * Math.sin(currentAngle);

  return (
    <Card className={`h-full flex flex-col rounded-[2.5rem] backdrop-blur-3xl border transition-all duration-500 ${isDark ? 'bg-white/5 border-white/10 shadow-2xl' : 'bg-white/60 border-slate-200 shadow-xl'}`}>
      <CardHeader className="pb-0">
        <CardTitle className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
          <Sun className="w-3.5 h-3.5 mr-2" />
          Sun & Moon
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center pt-6 pb-4">
        
        {/* Sun Arc Visualization */}
        <div className="relative w-[240px] h-[130px] overflow-hidden">
          {/* Background Arc */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 240 130">
            <path 
              d="M 20 110 A 100 100 0 0 1 220 110" 
              fill="none" 
              stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} 
              strokeWidth="2" 
              strokeDasharray="4 4"
            />
            {/* Filled Progress Arc */}
            {progress > 0 && (
              <path 
                d={`M 20 110 A 100 100 0 0 1 ${sunX} ${sunY}`} 
                fill="none" 
                stroke={isDark ? "rgba(250, 204, 21, 0.5)" : "rgba(234, 179, 8, 0.5)"} 
                strokeWidth="4" 
              />
            )}
            {/* Horizon Line */}
            <line x1="0" y1="110" x2="240" y2="110" stroke={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"} strokeWidth="1" />
          </svg>
          
          {/* Sun Icon */}
          <motion.div 
            className="absolute w-8 h-8 -ml-4 -mt-4 flex items-center justify-center bg-yellow-400/20 rounded-full backdrop-blur-sm border border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.5)]"
            initial={{ left: 20, top: 110 }}
            animate={{ left: sunX, top: sunY }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <Sun className="w-5 h-5 text-yellow-400" />
          </motion.div>
        </div>

        {/* Times */}
        <div className="flex justify-between w-full px-4 mt-2">
          <div className="flex flex-col items-center">
            <Sunrise className={`w-5 h-5 mb-1 ${isDark ? 'text-orange-300' : 'text-orange-500'}`} />
            <span className="text-sm font-bold">{current.sunrise}</span>
            <span className={`text-[10px] uppercase tracking-wider font-semibold ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Sunrise</span>
          </div>
          <div className="flex flex-col items-center">
            <Sunset className={`w-5 h-5 mb-1 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
            <span className="text-sm font-bold">{current.sunset}</span>
            <span className={`text-[10px] uppercase tracking-wider font-semibold ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Sunset</span>
          </div>
        </div>

        {/* Moon Info (if available) */}
        {current.moonIllumination !== undefined && (
          <div className={`w-full mt-6 pt-4 border-t flex items-center justify-between px-4 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
             <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-600'}`}>
                  <Moon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Moon Phase</span>
                  <span className={`text-[10px] uppercase tracking-wider font-semibold ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                    {current.moonIllumination}% Illumination
                  </span>
                </div>
             </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
