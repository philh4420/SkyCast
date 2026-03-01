import React from 'react';
import { WeatherData } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun } from 'lucide-react';
import { motion } from 'motion/react';

interface UVIndexWidgetProps {
  data: WeatherData;
  theme: 'light' | 'dark';
}

export const UVIndexWidget: React.FC<UVIndexWidgetProps> = ({ data, theme }) => {
  const isDark = theme === 'dark';
  const uv = data.current.uvIndex || 0;

  const getUVConfig = (val: number) => {
    if (val <= 2) return { color: '#10b981', label: 'Low', advice: 'No protection needed for most people.' };
    if (val <= 5) return { color: '#facc15', label: 'Moderate', advice: 'Wear sunglasses and use sunscreen.' };
    if (val <= 7) return { color: '#f97316', label: 'High', advice: 'Cover up, use sunscreen, seek shade.' };
    if (val <= 10) return { color: '#ef4444', label: 'Very High', advice: 'Avoid sun between 10am and 4pm.' };
    return { color: '#a855f7', label: 'Extreme', advice: 'Take all precautions. Skin burns in minutes.' };
  };

  const config = getUVConfig(uv);
  const percentage = Math.min(uv / 11, 1) * 100;

  return (
    <Card className={`h-full flex flex-col rounded-[2.5rem] overflow-hidden backdrop-blur-3xl border transition-all duration-500 ${isDark ? 'bg-white/5 border-white/10 shadow-2xl' : 'bg-white/60 border-slate-200 shadow-xl'}`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
          <Sun className="w-3.5 h-3.5 mr-2" />
          UV Index
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-between pb-6 pt-2">
        <div className="flex flex-col items-center justify-center flex-1">
          <span className={`text-6xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>{uv}</span>
          <span className="text-xl font-black tracking-tight mt-1" style={{ color: config.color }}>{config.label}</span>
        </div>
        
        <div className="w-full mt-6">
          <div className={`h-2.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)]"
              style={{ backgroundColor: config.color }}
            />
          </div>
          <p className={`text-xs font-medium mt-4 text-center leading-relaxed ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
            {config.advice}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
