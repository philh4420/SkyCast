import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { WeatherAlert } from '../types';

interface AlertsBannerProps {
  alerts: WeatherAlert[];
  theme: 'light' | 'dark';
}

export const AlertsBanner: React.FC<AlertsBannerProps> = ({ alerts, theme }) => {
  if (!alerts || alerts.length === 0) return null;
  const isDark = theme === 'dark';

  return (
    <div className="w-full space-y-3 mb-6">
      {alerts.map((alert, index) => {
        const isSevere = alert.severity?.toLowerCase() === 'extreme' || alert.severity?.toLowerCase() === 'severe';
        
        const severeClass = isDark 
          ? 'bg-red-500/20 border-red-500/50 text-red-100' 
          : 'bg-red-100 border-red-200 text-red-900 shadow-sm';
          
        const warningClass = isDark 
          ? 'bg-amber-500/20 border-amber-500/50 text-amber-100' 
          : 'bg-amber-100 border-amber-200 text-amber-900 shadow-sm';

        const instructionClass = isDark 
          ? 'bg-black/20 border-white/10' 
          : 'bg-white/50 border-black/5';

        return (
          <div 
            key={index} 
            className={`w-full rounded-2xl p-4 flex items-start gap-4 backdrop-blur-3xl border shadow-lg ${
              isSevere ? severeClass : warningClass
            }`}
          >
            <div className="mt-1">
              {isSevere 
                ? <AlertTriangle className={`w-6 h-6 ${isDark ? 'text-red-400' : 'text-red-600'}`} /> 
                : <Info className={`w-6 h-6 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
              }
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg leading-tight mb-1">{alert.headline || alert.desc}</h3>
              <p className="text-sm opacity-90 mb-2 line-clamp-2">{alert.desc}</p>
              {alert.instruction && (
                <div className={`text-xs p-3 rounded-xl border ${instructionClass}`}>
                  <span className="font-semibold uppercase tracking-wider block mb-1">Instruction:</span>
                  {alert.instruction}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
