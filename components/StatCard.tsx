
import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number | ReactNode;
  icon: ReactNode;
  description?: string | ReactNode;
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description, className = '' }) => {
  return (
    <Card className={`bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex flex-col justify-between hover:bg-slate-900/50 transition-all duration-300 group ${className}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="p-2.5 bg-white/5 rounded-2xl text-white/80 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
          {icon}
        </div>
        {description && (
          <div className="text-[10px] font-medium opacity-60 bg-white/5 px-2 py-1 rounded-full">
            {description}
          </div>
        )}
      </div>
      
      <div>
        <div className="text-2xl font-bold tracking-tight text-white mb-0.5">{value}</div>
        <div className="text-xs font-semibold uppercase tracking-wider text-white/50">{title}</div>
      </div>
    </Card>
  );
};
