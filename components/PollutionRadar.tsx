
import React from 'react';
import { AirQualityData } from '../types';
import { PollutantIcon } from '../icons';

interface PollutionRadarProps {
  data?: AirQualityData;
  aqi?: number;
  theme: 'light' | 'dark';
}

const PollutantBar = ({ label, value, max, unit, isDark }: { label: string, value: number, max: number, unit: string, isDark: boolean }) => {
  const percentage = Math.min((value / max) * 100, 100);
  let color = 'bg-emerald-400';
  if (percentage > 40) color = 'bg-yellow-400';
  if (percentage > 70) color = 'bg-orange-400';
  if (percentage > 90) color = 'bg-red-500';

  return (
    <div className="mb-3 group">
      <div className="flex justify-between items-end mb-1">
        <span className={`text-[10px] font-bold uppercase tracking-wider opacity-70 ${isDark ? 'text-blue-200' : 'text-slate-500'}`}>{label}</span>
        <span className={`text-xs font-mono opacity-90 ${isDark ? 'text-white' : 'text-slate-800'}`}>{value} <span className="text-[9px] opacity-50">{unit}</span></span>
      </div>
      <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-slate-200'}`}>
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${color}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const PollenItem = ({ label, count, icon, isDark }: { label: string, count: number, icon: React.ReactNode, isDark: boolean }) => {
  let status = 'Low';
  let color = isDark 
    ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20'
    : 'text-emerald-700 bg-emerald-100 border-emerald-200';
  
  if (count > 20) { 
    status = 'Moderate'; 
    color = isDark 
      ? 'text-yellow-300 bg-yellow-500/10 border-yellow-500/20'
      : 'text-yellow-700 bg-yellow-100 border-yellow-200'; 
  }
  if (count > 50) { 
    status = 'High'; 
    color = isDark 
      ? 'text-orange-300 bg-orange-500/10 border-orange-500/20'
      : 'text-orange-700 bg-orange-100 border-orange-200'; 
  }
  if (count > 150) { 
    status = 'Extreme'; 
    color = isDark 
      ? 'text-red-300 bg-red-500/10 border-red-500/20'
      : 'text-red-700 bg-red-100 border-red-200'; 
  }

  return (
    <div className={`flex flex-col items-center p-3 rounded-2xl border ${color} backdrop-blur-sm transition-transform hover:scale-105`}>
      <div className="mb-2 opacity-90 w-5 h-5">{icon}</div>
      <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-0.5">{label}</span>
      <span className="text-sm font-bold">{status}</span>
    </div>
  );
};

export const PollutionRadar: React.FC<PollutionRadarProps> = ({ data, aqi, theme }) => {
  if (!data) return null;
  const isDark = theme === 'dark';

  const getHealthAdvice = (aqiVal: number) => {
    if (aqiVal <= 50) return "Air quality is satisfactory, and air pollution poses little or no risk.";
    if (aqiVal <= 100) return "Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.";
    if (aqiVal <= 150) return "Members of sensitive groups may experience health effects. The general public is less likely to be affected.";
    if (aqiVal <= 200) return "Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.";
    if (aqiVal <= 300) return "Health alert: The risk of health effects is increased for everyone.";
    return "Health warning of emergency conditions: everyone is more likely to be affected.";
  };

  const containerClass = isDark 
    ? 'bg-black/20 backdrop-blur-3xl border border-white/10 shadow-2xl' 
    : 'bg-white/60 backdrop-blur-3xl border border-white/40 shadow-xl';

  return (
    <div className={`${containerClass} rounded-[2.5rem] p-6 transition-colors duration-500`}>
      <div className={`flex flex-col md:flex-row md:items-center justify-between mb-6 px-2 gap-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
         <div className={`flex items-center ${isDark ? 'opacity-70' : 'text-slate-600'}`}>
            <div className="w-4 h-4 mr-2">
               <PollutantIcon type="shield" />
            </div>
            <h3 className="text-sm font-medium uppercase tracking-wider">Air Quality</h3>
         </div>
         {aqi && (
           <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${isDark ? 'bg-black/20 border-white/5' : 'bg-white/50 border-white/20'}`}>
             <div className="text-sm font-medium">AQI: {aqi}</div>
             <div className="w-24 h-1.5 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 relative">
                <div className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-sm ${isDark ? 'border-black/50' : 'border-slate-300'}`} style={{ left: `${Math.min((aqi / 300) * 100, 100)}%` }} />
             </div>
           </div>
         )}
      </div>

      {aqi && (
        <div className="px-2 mb-6">
          <p className={`text-sm opacity-80 leading-relaxed border-l-2 pl-3 ${isDark ? 'border-white/20 text-white' : 'border-slate-300 text-slate-700'}`}>
            {getHealthAdvice(aqi)}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
        {/* Left: Pollutants */}
        <div>
           <div className={`flex items-center gap-2 mb-4 ${isDark ? 'opacity-70 text-white' : 'text-slate-600'}`}>
              <span className="text-sm font-medium">Pollutants</span>
           </div>
           
           <PollutantBar label="PM 2.5" value={data.pm2_5} max={35} unit="µg/m³" isDark={isDark} />
           <PollutantBar label="PM 10" value={data.pm10} max={50} unit="µg/m³" isDark={isDark} />
           <PollutantBar label="NO₂" value={data.no2} max={40} unit="µg/m³" isDark={isDark} />
           <PollutantBar label="O₃" value={data.o3} max={100} unit="µg/m³" isDark={isDark} />
        </div>

        {/* Right: Pollen */}
        <div>
           <div className={`flex items-center gap-2 mb-4 ${isDark ? 'opacity-70 text-white' : 'text-slate-600'}`}>
              <span className="text-sm font-medium">Pollen</span>
           </div>
           
           <div className="grid grid-cols-3 gap-3">
              <PollenItem label="Grass" count={data.pollen.grass} icon={<PollutantIcon type="sprout" />} isDark={isDark} />
              <PollenItem label="Tree" count={data.pollen.tree} icon={<PollutantIcon type="leaf" />} isDark={isDark} />
              <PollenItem label="Weed" count={data.pollen.weed} icon={<PollutantIcon type="flower" />} isDark={isDark} />
           </div>
        </div>
      </div>
    </div>
  );
};
