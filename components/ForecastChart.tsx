
import React from 'react';
import { ComposedChart, Area, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { HourlyForecast } from '../types';
import { UtilityIcon } from '../icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ForecastChartProps {
  data: HourlyForecast[];
  unit: 'metric' | 'imperial';
  theme: 'light' | 'dark';
}

const CustomTooltip = ({ active, payload, label, isDark }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    const bgClass = isDark ? 'bg-black/40 backdrop-blur-xl border-white/20 text-white' : 'bg-white/80 backdrop-blur-xl border-white/40 text-slate-800 shadow-xl';
    const labelClass = isDark ? 'text-white/70 border-white/10' : 'text-slate-500 border-slate-200';
    const subTextClass = isDark ? 'opacity-60' : 'text-slate-500';
    const cardBg = isDark ? 'bg-white/5 border-white/5' : 'bg-white/50 border-white/20';

    return (
      <div className={`${bgClass} border p-4 rounded-2xl shadow-2xl min-w-[200px] z-50 animate-fade-in`}>
        <p className={`text-xs font-bold uppercase tracking-wider mb-3 border-b pb-2 ${labelClass}`}>{label}</p>
        
        <div className="flex items-center justify-between mb-4">
            <span className="text-4xl font-bold tracking-tighter">{d.temp}°</span>
            <div className="text-right">
                <div className={`text-[10px] font-medium uppercase mb-0.5 ${subTextClass}`}>Feels Like</div>
                <div className="flex items-center justify-end gap-1.5">
                   <div className="w-3 h-3 opacity-80">
                      <UtilityIcon type="feels-like" />
                   </div>
                   <div className="text-lg font-semibold">{d.feelsLike}°</div>
                </div>
            </div>
        </div>

        <div className={`space-y-2.5 p-3 rounded-xl border ${cardBg}`}>
            <div className="flex items-center justify-between text-xs">
                <div className={`flex items-center gap-2 ${subTextClass}`}>
                    <div className="w-3.5 h-3.5">
                       <UtilityIcon type="rain" />
                    </div>
                    <span>Precipitation</span>
                </div>
                <span className={`font-medium ${isDark ? 'text-blue-200' : 'text-blue-600'}`}>{d.precip}%</span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
                <div className={`flex items-center gap-2 ${subTextClass}`}>
                    <div className="w-3.5 h-3.5">
                       <UtilityIcon type="wind" />
                    </div>
                    <span>Wind</span>
                </div>
                <span className="font-medium">{d.windSpeed} <span className="text-[10px] opacity-50">{d.windUnit}</span></span>
            </div>

            <div className="flex items-center justify-between text-xs">
                <div className={`flex items-center gap-2 ${subTextClass}`}>
                    <div className="w-3.5 h-3.5">
                       <UtilityIcon type="humidity" />
                    </div>
                    <span>Humidity</span>
                </div>
                <span className="font-medium">{d.humidity}%</span>
            </div>
        </div>
        
        {d.condition && (
             <div className={`mt-3 text-[10px] font-medium text-center py-1.5 rounded-lg border uppercase tracking-wide ${isDark ? 'bg-white/10 text-white/80 border-white/5' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                {d.condition}
             </div>
        )}
      </div>
    );
  }
  return null;
};

export const ForecastChart: React.FC<ForecastChartProps> = ({ data, unit, theme }) => {
  if (!data || data.length === 0) return null;
  const isDark = theme === 'dark';

  // Process data for the next 24 hours
  const chartData = data.slice(0, 24).map(d => ({
    time: new Date(d.time).toLocaleTimeString([], { hour: 'numeric' }),
    temp: unit === 'metric' ? Math.round(d.temp) : Math.round(d.temp * 9/5 + 32),
    feelsLike: unit === 'metric' ? Math.round(d.feelsLike) : Math.round(d.feelsLike * 9/5 + 32),
    precip: Math.round(d.precipProb),
    windSpeed: unit === 'metric' ? Math.round(d.windSpeed) : Math.round(d.windSpeed * 0.62),
    windUnit: unit === 'metric' ? 'km/h' : 'mph',
    humidity: Math.round(d.humidity),
    condition: d.condition
  }));

  const maxTemp = Math.max(...chartData.map(d => d.temp));
  const minTemp = Math.min(...chartData.map(d => d.temp));

  return (
    <Card className={`rounded-[2.5rem] backdrop-blur-2xl border bg-white/5 border-white/10 shadow-lg h-full flex flex-col ${!isDark && 'bg-white/50 border-slate-200/80'}`}>
      <CardHeader className="pb-2">
        <div className={`flex items-center justify-between ${isDark ? 'opacity-70' : 'text-slate-600'}`}>
           <CardTitle className="flex items-center text-sm font-medium uppercase tracking-wider">
              <div className="w-4 h-4 mr-2">
                 <UtilityIcon type="averages" />
              </div>
              Temperature & Precipitation
           </CardTitle>
           <div className="flex items-center gap-3 text-xs font-medium">
               <div className="flex items-center gap-1">
                   <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-white' : 'bg-slate-800'}`}></div>
                   <span>Temp</span>
               </div>
               <div className="flex items-center gap-1">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                   <span>Rain %</span>
               </div>
           </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isDark ? "#ffffff" : "#334155"} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={isDark ? "#ffffff" : "#334155"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"} strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              tick={{ fill: isDark ? 'rgba(255,255,255,0.6)' : '#64748b', fontSize: 12, fontWeight: 500 }} 
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={30}
              dy={10}
            />
            
            {/* Temp Axis (Left) */}
            <YAxis 
              yAxisId="left"
              hide={true}
              domain={[minTemp - 5, maxTemp + 5]}
            />
            
            {/* Precip Axis (Right) */}
            <YAxis 
              yAxisId="right"
              orientation="right"
              hide={true}
              domain={[0, 100]}
            />

            <Tooltip content={<CustomTooltip isDark={isDark} />} cursor={{ stroke: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)', strokeWidth: 1 }} />
            
            {/* Precipitation Bars */}
            <Bar yAxisId="right" dataKey="precip" barSize={8} radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`rgba(59, 130, 246, ${Math.max(0.2, entry.precip / 100)})`} />
              ))}
            </Bar>

            {/* Temperature Area */}
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="temp" 
              stroke={isDark ? "#ffffff" : "#334155"} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorTemp)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: isDark ? '#fff' : '#1e293b' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
