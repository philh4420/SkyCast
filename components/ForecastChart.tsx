
import React from 'react';
import { ComposedChart, Area, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { HourlyForecast } from '../types';
import { UtilityIcon } from '../icons';

interface ForecastChartProps {
  data: HourlyForecast[];
  unit: 'metric' | 'imperial';
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-black/40 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl text-white min-w-[200px] z-50 animate-fade-in">
        <p className="text-xs font-bold uppercase tracking-wider text-white/70 mb-3 border-b border-white/10 pb-2">{label}</p>
        
        <div className="flex items-center justify-between mb-4">
            <span className="text-4xl font-bold tracking-tighter">{d.temp}°</span>
            <div className="text-right">
                <div className="text-[10px] font-medium opacity-60 uppercase mb-0.5">Feels Like</div>
                <div className="flex items-center justify-end gap-1.5">
                   <div className="w-3 h-3 opacity-80">
                      <UtilityIcon type="feels-like" />
                   </div>
                   <div className="text-lg font-semibold">{d.feelsLike}°</div>
                </div>
            </div>
        </div>

        <div className="space-y-2.5 bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 opacity-70">
                    <div className="w-3.5 h-3.5">
                       <UtilityIcon type="rain" />
                    </div>
                    <span>Precipitation</span>
                </div>
                <span className="font-medium text-blue-200">{d.precip}%</span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 opacity-70">
                    <div className="w-3.5 h-3.5">
                       <UtilityIcon type="wind" />
                    </div>
                    <span>Wind</span>
                </div>
                <span className="font-medium">{d.windSpeed} <span className="text-[10px] opacity-50">{d.windUnit}</span></span>
            </div>

            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 opacity-70">
                    <div className="w-3.5 h-3.5">
                       <UtilityIcon type="humidity" />
                    </div>
                    <span>Humidity</span>
                </div>
                <span className="font-medium">{d.humidity}%</span>
            </div>
        </div>
        
        {d.condition && (
             <div className="mt-3 text-[10px] font-medium text-center bg-white/10 py-1.5 rounded-lg text-white/80 border border-white/5 uppercase tracking-wide">
                {d.condition}
             </div>
        )}
      </div>
    );
  }
  return null;
};

export const ForecastChart: React.FC<ForecastChartProps> = ({ data, unit }) => {
  if (!data || data.length === 0) return null;

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
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 px-2 opacity-70">
         <div className="flex items-center">
            <div className="w-4 h-4 mr-2">
               <UtilityIcon type="averages" />
            </div>
            <h3 className="text-sm font-medium uppercase tracking-wider">Temperature & Precipitation</h3>
         </div>
         <div className="flex items-center gap-3 text-xs font-medium">
             <div className="flex items-center gap-1">
                 <div className="w-2 h-2 rounded-full bg-white"></div>
                 <span>Temp</span>
             </div>
             <div className="flex items-center gap-1">
                 <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                 <span>Rain %</span>
             </div>
         </div>
      </div>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 500 }} 
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

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }} />
            
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
              stroke="#ffffff" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorTemp)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
