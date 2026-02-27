import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { WeatherAlert } from '../api/_shared/types';

interface AlertsBannerProps {
  alerts: WeatherAlert[];
}

export const AlertsBanner: React.FC<AlertsBannerProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="w-full space-y-3 mb-6">
      {alerts.map((alert, index) => {
        const isSevere = alert.severity?.toLowerCase() === 'extreme' || alert.severity?.toLowerCase() === 'severe';
        
        return (
          <div 
            key={index} 
            className={`w-full rounded-2xl p-4 flex items-start gap-4 backdrop-blur-3xl border shadow-lg ${
              isSevere 
                ? 'bg-red-500/20 border-red-500/50 text-red-100' 
                : 'bg-amber-500/20 border-amber-500/50 text-amber-100'
            }`}
          >
            <div className="mt-1">
              {isSevere ? <AlertTriangle className="w-6 h-6 text-red-400" /> : <Info className="w-6 h-6 text-amber-400" />}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg leading-tight mb-1">{alert.headline || alert.desc}</h3>
              <p className="text-sm opacity-90 mb-2 line-clamp-2">{alert.desc}</p>
              {alert.instruction && (
                <div className="text-xs bg-black/20 p-3 rounded-xl border border-white/10">
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
