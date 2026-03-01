import React from 'react';
import { WeatherData } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Umbrella, Shirt, Sun, Wind, CloudRain, Snowflake } from 'lucide-react';

interface SmartSuggestionsWidgetProps {
  data: WeatherData;
  unit: 'metric' | 'imperial';
  theme: 'light' | 'dark';
}

export const SmartSuggestionsWidget: React.FC<SmartSuggestionsWidgetProps> = ({ data, unit, theme }) => {
  const isDark = theme === 'dark';
  const { current, forecast } = data;

  const temp = unit === 'metric' ? current.temp : current.temp * 9/5 + 32;
  const wind = unit === 'metric' ? current.windSpeed : current.windSpeed * 0.621371;
  const precipProb = forecast[0]?.precipitationProb || 0;

  const getSuggestions = () => {
    const suggestions = [];

    // Temperature based
    if (temp < (unit === 'metric' ? 5 : 41)) {
      suggestions.push({ icon: <Snowflake className="w-5 h-5 text-blue-400" />, text: "Bundle up! It's freezing outside." });
    } else if (temp < (unit === 'metric' ? 15 : 59)) {
      suggestions.push({ icon: <Shirt className="w-5 h-5 text-indigo-400" />, text: "A light jacket or sweater is recommended." });
    } else if (temp > (unit === 'metric' ? 28 : 82)) {
      suggestions.push({ icon: <Sun className="w-5 h-5 text-yellow-400" />, text: "It's hot! Stay hydrated and wear light clothing." });
    } else {
      suggestions.push({ icon: <Shirt className="w-5 h-5 text-emerald-400" />, text: "Perfect weather for a t-shirt." });
    }

    // Precipitation based
    if (precipProb > 50 || current.condition.includes('rain') || current.condition.includes('drizzle')) {
      suggestions.push({ icon: <Umbrella className="w-5 h-5 text-blue-500" />, text: "Don't forget your umbrella, rain is likely." });
    } else if (precipProb > 20) {
      suggestions.push({ icon: <CloudRain className="w-5 h-5 text-slate-400" />, text: "Slight chance of rain. Might want a raincoat just in case." });
    }

    // Wind based
    if (wind > (unit === 'metric' ? 30 : 18)) {
      suggestions.push({ icon: <Wind className="w-5 h-5 text-teal-400" />, text: "It's quite windy out there. Hold onto your hat!" });
    }

    // UV based
    if (current.uvIndex && current.uvIndex > 5) {
      suggestions.push({ icon: <Sun className="w-5 h-5 text-orange-400" />, text: "High UV index. Sunscreen is a must today." });
    }

    return suggestions;
  };

  const suggestions = getSuggestions();

  return (
    <Card className={`h-full flex flex-col rounded-[2.5rem] overflow-hidden backdrop-blur-3xl border transition-all duration-500 ${isDark ? 'bg-white/5 border-white/10 shadow-2xl' : 'bg-white/60 border-slate-200 shadow-xl'}`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
          <Sparkles className="w-3.5 h-3.5 mr-2" />
          Smart Suggestions
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-3 pt-2 justify-center">
        {suggestions.map((s, i) => (
          <div key={i} className={`flex items-center gap-4 p-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white/80 border-slate-100'}`}>
            <div className={`p-2 rounded-full ${isDark ? 'bg-black/20' : 'bg-slate-100'}`}>
              {s.icon}
            </div>
            <p className={`text-sm font-medium leading-tight ${isDark ? 'text-white/90' : 'text-slate-700'}`}>
              {s.text}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
