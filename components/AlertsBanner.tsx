import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { WeatherAlert } from '../types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
        
        const instructionClass = isDark 
          ? 'bg-black/20 border-white/10' 
          : 'bg-white/50 border-black/5';

        return (
          <Alert 
            key={index} 
            variant={isSevere ? "destructive" : "default"}
            className={`backdrop-blur-3xl border shadow-lg rounded-2xl ${
              !isSevere && (isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-100' : 'bg-amber-50/80 border-amber-200 text-amber-900')
            } ${isSevere && (isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50/80 border-red-200')}`}
          >
            {isSevere 
              ? <AlertTriangle className="h-4 w-4" /> 
              : <Info className="h-4 w-4" />
            }
            <AlertTitle className="font-bold text-lg">{alert.headline || alert.desc}</AlertTitle>
            <AlertDescription>
              <p className="text-sm opacity-90 mb-2 line-clamp-2">{alert.desc}</p>
              {alert.instruction && (
                <div className={`text-xs p-3 rounded-xl border mt-2 ${instructionClass}`}>
                  <span className="font-semibold uppercase tracking-wider block mb-1">Instruction:</span>
                  {alert.instruction}
                </div>
              )}
            </AlertDescription>
          </Alert>
        );
      })}
    </div>
  );
};
