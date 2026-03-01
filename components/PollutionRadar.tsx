
import React from 'react';
import { AirQualityData } from '../types';
import { PollutantIcon } from '../icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'motion/react';

interface PollutionRadarProps {
  data?: AirQualityData;
  aqi?: number;
  theme: 'light' | 'dark';
}

const PollutantIndicator = ({ label, value, max, unit, isDark }: { label: string, value: number, max: number, unit: string, isDark: boolean }) => {
  const percentage = Math.min((value / max) * 100, 100);
  let colorClass = 'bg-emerald-500';
  if (percentage > 40) colorClass = 'bg-yellow-500';
  if (percentage > 70) colorClass = 'bg-orange-500';
  if (percentage > 90) colorClass = 'bg-red-500';

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-end">
        <span className={`text-[10px] font-bold uppercase tracking-widest opacity-50 ${isDark ? 'text-white' : 'text-slate-900'}`}>{label}</span>
        <span className={`text-xs font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}<span className="text-[9px] font-normal opacity-40 ml-0.5">{unit}</span></span>
      </div>
      <div className={`h-1 w-full rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200'} overflow-hidden`}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full rounded-full ${colorClass} shadow-[0_0_8px_rgba(0,0,0,0.2)]`}
        />
      </div>
    </div>
  );
};

const PollenBadge = ({ label, count, icon, isDark }: { label: string, count: number, icon: React.ReactNode, isDark: boolean }) => {
  let status = 'Low';
  let colorStyles = isDark 
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    : 'bg-emerald-50/80 text-emerald-700 border-emerald-200';
  
  if (count > 20) { 
    status = 'Mod'; 
    colorStyles = isDark 
      ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      : 'bg-yellow-50/80 text-yellow-700 border-yellow-200'; 
  }
  if (count > 50) { 
    status = 'High'; 
    colorStyles = isDark 
      ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
      : 'bg-orange-50/80 text-orange-700 border-orange-200'; 
  }
  if (count > 150) { 
    status = 'Ext'; 
    colorStyles = isDark 
      ? 'bg-red-500/10 text-red-400 border-red-500/20'
      : 'bg-red-50/80 text-red-700 border-red-200'; 
  }

  return (
    <div className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border ${colorStyles} transition-all hover:scale-105 active:scale-95 cursor-default`}>
      <div className="w-5 h-5 mb-1.5 drop-shadow-sm">{icon}</div>
      <div className="text-[9px] font-black uppercase tracking-tighter opacity-60 leading-none mb-1">{label}</div>
      <div className="text-[10px] font-bold leading-none">{status}</div>
    </div>
  );
};

export const PollutionRadar: React.FC<PollutionRadarProps> = ({ data, aqi, theme }) => {
  if (!data) return null;
  const isDark = theme === 'dark';

  const getAQIConfig = (val: number) => {
    if (val <= 50) return { color: '#10b981', label: 'Good', advice: 'Ideal for outdoor activities.' };
    if (val <= 100) return { color: '#f59e0b', label: 'Moderate', advice: 'Sensitive groups should limit time outside.' };
    if (val <= 150) return { color: '#f97316', label: 'Unhealthy+', advice: 'Limit prolonged outdoor exertion.' };
    if (val <= 200) return { color: '#ef4444', label: 'Unhealthy', advice: 'Avoid outdoor activities if possible.' };
    if (val <= 300) return { color: '#a855f7', label: 'Very Unhealthy', advice: 'Stay indoors with air filtration.' };
    return { color: '#e11d48', label: 'Hazardous', advice: 'Health emergency. Stay indoors.' };
  };

  const config = getAQIConfig(aqi || 0);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((Math.min(aqi || 0, 300) / 300) * circumference);

  return (
    <Card className={`h-full flex flex-col rounded-[2.5rem] overflow-hidden backdrop-blur-3xl border transition-all duration-500 ${isDark ? 'bg-white/5 border-white/10 shadow-2xl' : 'bg-white/60 border-slate-200 shadow-xl'}`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
          <PollutantIcon type="shield" className="w-3.5 h-3.5 mr-2" />
          Air Quality Index
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-6 pt-2 justify-center">
        {/* AQI Circular Gauge */}
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform">
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className={isDark ? 'text-white/5' : 'text-slate-100'}
              />
              <motion.circle
                cx="48"
                cy="48"
                r={radius}
                stroke={config.color}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 2, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>{aqi}</span>
              <span className="text-[8px] font-black uppercase tracking-widest opacity-40">AQI</span>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="text-lg font-black tracking-tight mb-1" style={{ color: config.color }}>{config.label}</div>
            <p className={`text-[11px] leading-relaxed font-medium ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
              {config.advice}
            </p>
          </div>
        </div>

        {/* Pollutants Grid */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <PollutantIndicator label="PM 2.5" value={data.pm2_5} max={35} unit="µg/m³" isDark={isDark} />
            <PollutantIndicator label="PM 10" value={data.pm10} max={50} unit="µg/m³" isDark={isDark} />
            <PollutantIndicator label="NO₂" value={data.no2} max={40} unit="µg/m³" isDark={isDark} />
          </div>

          <div className={`p-4 rounded-3xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
             <div className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-3 flex items-center gap-2">
                <PollutantIcon type="leaf" className="w-3 h-3" />
                Pollen Levels
             </div>
             <div className="grid grid-cols-3 gap-2">
                <PollenBadge label="Grass" count={data.pollen.grass} icon={<PollutantIcon type="sprout" />} isDark={isDark} />
                <PollenBadge label="Tree" count={data.pollen.tree} icon={<PollutantIcon type="leaf" />} isDark={isDark} />
                <PollenBadge label="Weed" count={data.pollen.weed} icon={<PollutantIcon type="flower" />} isDark={isDark} />
             </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

