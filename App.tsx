
import React, { useState, useEffect } from 'react';
import { WeatherData, UserSettings, GeoLocation } from './types';
import { DEFAULT_LAT, DEFAULT_LON } from './constants';
import { getWeather } from './services/weatherService';
import { getWeatherVideo } from './services/mediaService';
import { CurrentWeather } from './components/CurrentWeather';
import { ForecastChart } from './components/ForecastChart';
import { DailyForecastList } from './components/DailyForecastList';
import { HourlyForecastStrip } from './components/HourlyForecastStrip';
import { PollutionRadar } from './components/PollutionRadar';
import { SettingsModal } from './components/SettingsModal';
import { WeatherMap } from './components/WeatherMap';
import { WeatherDetailsGrid } from './components/WeatherDetailsGrid';
import { AstronomyWidget } from './components/AstronomyWidget';
import { WindCompassWidget } from './components/WindCompassWidget';
import { SmartSuggestionsWidget } from './components/SmartSuggestionsWidget';
import { UVIndexWidget } from './components/UVIndexWidget';
import { ComfortWidget } from './components/ComfortWidget';
import { RainfallWidget, FeelsLikeWidget, HumidityWidget, VisibilityWidget, PressureWidget, SimpleUVWidget, SimpleWindWidget, CloudCoverWidget, SoilTempWidget, DewPointWidget } from './components/MiniWidgets';

import { AlertsBanner } from './components/AlertsBanner';
import { Search, MapPin, Settings, AlertTriangle, CloudLightning, CloudSun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('skycast-settings');
    const defaultWidgets = [
      { id: 'current', visible: true },
      { id: 'hourly', visible: true },
      { id: 'airQuality', visible: true },
      { id: 'uvIndex', visible: true },
      { id: 'comfort', visible: true },
      { id: 'astronomy', visible: true },
      { id: 'wind', visible: true },
      { id: 'suggestions', visible: true },
      { id: 'rainfall', visible: true },
      { id: 'feelsLike', visible: true },
      { id: 'humidity', visible: true },
      { id: 'visibility', visible: true },
      { id: 'pressure', visible: true },
      { id: 'cloudCover', visible: true },
      { id: 'soilTemp', visible: true },
      { id: 'dewPoint', visible: true },
      { id: 'map', visible: true },
      { id: 'daily', visible: true },
      { id: 'chart', visible: true }
    ];
    const defaultSettings: UserSettings = {
      units: 'metric',
      theme: 'dark',
      widgets: defaultWidgets
    };
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure widgets exist in saved settings, or merge with defaults
      if (!parsed.widgets || parsed.widgets.length === 0) {
        parsed.widgets = defaultWidgets;
      } else {
        // Add any missing new widgets to the end
        const existingIds = new Set(parsed.widgets.map((w: any) => w.id));
        defaultWidgets.forEach(w => {
          if (!existingIds.has(w.id)) {
            parsed.widgets.push(w);
          }
        });
      }
      return { ...defaultSettings, ...parsed };
    }
    return defaultSettings;
  });

  const [coords, setCoords] = useState<GeoLocation>({ lat: DEFAULT_LAT, lon: DEFAULT_LON });

  useEffect(() => {
    localStorage.setItem('skycast-settings', JSON.stringify(settings));
  }, [settings]);

  // Theme Handling
  const isDark = settings.theme === 'dark';
  
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const themeClass = isDark ? 'text-white' : 'text-slate-900';
  const bgClass = isDark ? 'bg-black' : 'bg-slate-100';
  
  // Premium Glass Effect - Dynamic based on theme
  const glassClass = isDark 
    ? 'bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl'
    : 'bg-white/60 backdrop-blur-2xl border border-white/40 shadow-xl';
    
  const inputClass = isDark
    ? 'bg-white/5 border-white/10 text-white placeholder-white/50 focus:bg-white/10 focus:border-white/20 backdrop-blur-md'
    : 'bg-white/60 border-white/20 text-slate-900 placeholder-slate-500 focus:bg-white/80 focus:border-blue-400 backdrop-blur-md shadow-sm';

  const fetchData = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeather(lat, lon);
      setWeather(data);

      const mediaData = await getWeatherVideo(data.current.condition, data.current.iconCode);
      if (mediaData.videoUrl) setVideoUrl(mediaData.videoUrl);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData(coords.lat, coords.lon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords]);

  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=1&language=en&format=json`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const { latitude, longitude, name } = data.results[0];
        setCoords({ lat: latitude, lon: longitude, name });
        setSearchQuery('');
        setVideoUrl(null);
      } else {
        setError('Location not found.');
        setLoading(false);
      }
    } catch (err) {
      setError('Error searching for location.');
      setLoading(false);
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      setVideoUrl(null);
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => { setError('Location permission denied.'); setLoading(false); }
      );
    } else {
      setError('Geolocation not supported.');
    }
  };

  const getAtmosphere = (code: string) => {
    const base = "transition-all duration-[2000ms] ease-in-out bg-gradient-to-br";
    if (!weather) return isDark ? `${base} from-slate-900 to-black` : `${base} from-blue-100 to-white`;

    const isNight = code.includes('night');
    
    // Dark Mode Gradients
    if (isDark) {
        if (code.includes('thunder')) return `${base} from-[#1c1c1e] via-[#2c2c2e] to-[#000000]`;
        if (code.includes('rain') || code.includes('drizzle')) return isNight ? `${base} from-[#1c1c1e] via-[#2c2c2e] to-[#000000]` : `${base} from-[#4a5568] via-[#2d3748] to-[#1a202c]`; 
        if (code.includes('snow')) return isNight ? `${base} from-[#1c1c1e] via-[#2d3748] to-[#000000]` : `${base} from-[#e2e8f0] via-[#cbd5e1] to-[#94a3b8]`; 
        if (code.includes('clear')) return isNight ? `${base} from-[#000000] via-[#1c1c1e] to-[#000000]` : `${base} from-[#38bdf8] via-[#0ea5e9] to-[#0284c7]`;
        if (code.includes('cloudy') || code.includes('fog') || code.includes('mist')) return isNight ? `${base} from-[#1c1c1e] via-[#2c2c2e] to-[#000000]` : `${base} from-[#64748b] via-[#475569] to-[#334155]`; 
        return `${base} from-[#1c1c1e] via-[#000000] to-[#000000]`;
    }

    // Light Mode Gradients
    if (code.includes('thunder')) return `${base} from-slate-700 via-slate-600 to-slate-800`;
    if (code.includes('rain') || code.includes('drizzle')) return `${base} from-blue-200 via-slate-200 to-slate-300`; 
    if (code.includes('snow')) return `${base} from-blue-50 via-white to-blue-100`; 
    if (code.includes('clear')) return isNight ? `${base} from-indigo-900 via-slate-800 to-black` : `${base} from-blue-400 via-blue-300 to-blue-100`;
    if (code.includes('cloudy') || code.includes('fog') || code.includes('mist')) return `${base} from-slate-300 via-slate-200 to-slate-100`; 
    return `${base} from-blue-50 to-white`;
  };

  const bgGradient = getAtmosphere(weather?.current.iconCode || '');
  
  const finalTextColor = isDark ? 'text-white' : 'text-slate-900';

  return (
    <div className={`min-h-screen ${finalTextColor} font-sans relative overflow-x-hidden selection:bg-blue-500/30 ${bgClass}`}>
      
      {videoUrl && (
        <div className={`fixed inset-0 z-0 transition-opacity duration-1000 ease-in-out ${isDark ? 'opacity-100' : 'opacity-60'}`}>
           <video autoPlay loop muted playsInline className="w-full h-full object-cover scale-105 filter brightness-75 contrast-125" key={videoUrl}>
             <source src={videoUrl} type="video/mp4" />
           </video>
        </div>
      )}

      <div className={`fixed inset-0 z-0 ${bgGradient} mix-blend-multiply pointer-events-none ${isDark ? 'opacity-80' : 'opacity-20'}`}></div>
      <div className={`fixed inset-0 pointer-events-none mix-blend-overlay z-0 ${isDark ? 'opacity-[0.03]' : 'opacity-[0.05]'}`} style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 py-8 max-w-[1600px]">
        
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          
          <div className="flex items-center gap-3 cursor-pointer group select-none" onClick={() => window.location.reload()}>
             <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-500">
                <CloudSun className="w-6 h-6 text-white drop-shadow-md" />
                <div className="absolute inset-0 rounded-xl ring-1 ring-white/20 inset-shadow pointer-events-none"></div>
             </div>
             <div className="flex flex-col">
                <span className="text-xl font-semibold tracking-tight font-serif">SkyCast</span>
             </div>
          </div>

          <div className="flex w-full md:w-auto items-center gap-3">
             <form onSubmit={handleLocationSearch} className="flex-1 md:w-80 relative group z-20">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className={`w-4 h-4 transition-colors ${isDark ? 'text-white/50 group-focus-within:text-white' : 'text-slate-500 group-focus-within:text-slate-900'}`} />
               </div>
               <Input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search city..." 
                 className={`w-full ${inputClass} rounded-full pl-11 pr-4 py-2.5 text-sm font-medium focus:outline-none transition-all shadow-inner border-none`}
               />
             </form>

             <TooltipProvider>
               <div className="flex items-center gap-2">
                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Button 
                       variant="ghost"
                       size="icon"
                       onClick={handleCurrentLocation} 
                       className={`w-10 h-10 ${glassClass} rounded-full transition-all active:scale-95 group hover:bg-white/20`}
                     >
                       <MapPin className="w-5 h-5 group-hover:animate-bounce" />
                     </Button>
                   </TooltipTrigger>
                   <TooltipContent>
                     <p>Use Current Location</p>
                   </TooltipContent>
                 </Tooltip>
                 
                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Button 
                       variant="ghost"
                       size="icon"
                       onClick={() => setSettingsOpen(true)} 
                       className={`w-10 h-10 ${glassClass} rounded-full transition-all active:scale-95 group hover:bg-white/20`}
                     >
                       <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                     </Button>
                   </TooltipTrigger>
                   <TooltipContent>
                     <p>Settings</p>
                   </TooltipContent>
                 </Tooltip>
               </div>
             </TooltipProvider>
          </div>
        </header>

        {error && (
          <Alert variant="destructive" className="animate-fade-in mb-8 backdrop-blur-md bg-red-500/10 border-red-500/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {weather && !loading ? (
          <>
            {weather.alerts && <AlertsBanner alerts={weather.alerts} theme={settings.theme} />}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 items-stretch">
              {settings.widgets?.filter(w => w.visible).map(widget => {
                switch (widget.id) {
                  case 'current':
                    return (
                      <div key="current" className="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2">
                        <CurrentWeather data={weather} unit={settings.units} theme={settings.theme} />
                      </div>
                    );
                  case 'airQuality':
                    return weather.current.airQuality ? (
                      <div key="airQuality" className="col-span-1">
                        <PollutionRadar data={weather.current.airQuality} aqi={weather.current.aqi} theme={settings.theme} />
                      </div>
                    ) : null;
                  case 'astronomy':
                    return (
                      <div key="astronomy" className="col-span-1">
                        <AstronomyWidget data={weather} theme={settings.theme} />
                      </div>
                    );
                  case 'wind':
                    return (
                      <div key="wind" className="col-span-1">
                        <WindCompassWidget data={weather} unit={settings.units} theme={settings.theme} />
                      </div>
                    );
                  case 'suggestions':
                    return (
                      <div key="suggestions" className="col-span-1">
                        <SmartSuggestionsWidget data={weather} unit={settings.units} theme={settings.theme} />
                      </div>
                    );
                  case 'uvIndex':
                    return (
                      <div key="uvIndex" className="col-span-1">
                        <UVIndexWidget data={weather} theme={settings.theme} />
                      </div>
                    );
                  case 'comfort':
                    return (
                      <div key="comfort" className="col-span-1">
                        <ComfortWidget data={weather} unit={settings.units} theme={settings.theme} />
                      </div>
                    );
                  case 'rainfall':
                    return (
                      <div key="rainfall" className="col-span-1">
                        <RainfallWidget data={weather} unit={settings.units} theme={settings.theme} />
                      </div>
                    );
                  case 'feelsLike':
                    return (
                      <div key="feelsLike" className="col-span-1">
                        <FeelsLikeWidget data={weather} unit={settings.units} theme={settings.theme} />
                      </div>
                    );
                  case 'humidity':
                    return (
                      <div key="humidity" className="col-span-1">
                        <HumidityWidget data={weather} unit={settings.units} theme={settings.theme} />
                      </div>
                    );
                  case 'visibility':
                    return (
                      <div key="visibility" className="col-span-1">
                        <VisibilityWidget data={weather} unit={settings.units} theme={settings.theme} />
                      </div>
                    );
                  case 'pressure':
                    return (
                      <div key="pressure" className="col-span-1">
                        <PressureWidget data={weather} unit={settings.units} theme={settings.theme} />
                      </div>
                    );
                  case 'simpleUv':
                    return (
                      <div key="simpleUv" className="col-span-1">
                        <SimpleUVWidget data={weather} unit={settings.units} theme={settings.theme} />
                      </div>
                    );
                  case 'simpleWind':
                    return (
                      <div key="simpleWind" className="col-span-1">
                        <SimpleWindWidget data={weather} unit={settings.units} theme={settings.theme} />
                      </div>
                    );
                  case 'cloudCover':
                    return (
                      <div key="cloudCover" className="col-span-1">
                        <CloudCoverWidget data={weather} unit={settings.units} theme={settings.theme} />
                      </div>
                    );
                  case 'soilTemp':
                    return (
                      <div key="soilTemp" className="col-span-1">
                        <SoilTempWidget data={weather} unit={settings.units} theme={settings.theme} />
                      </div>
                    );
                  case 'dewPoint':
                    return (
                      <div key="dewPoint" className="col-span-1">
                        <DewPointWidget data={weather} unit={settings.units} theme={settings.theme} />
                      </div>
                    );
                  case 'hourly':
                    return (
                      <div key="hourly" className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4">
                        <HourlyForecastStrip data={weather.hourly} unit={settings.units} sunrise={weather.current.sunrise} sunset={weather.current.sunset} theme={settings.theme} />
                      </div>
                    );
                  case 'map':
                    return (
                      <div key="map" className="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2 h-[600px]">
                        <WeatherMap lat={coords.lat} lon={coords.lon} unit={settings.units} theme={settings.theme} />
                      </div>
                    );
                  case 'daily':
                    return (
                      <div key="daily" className="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2">
                        <DailyForecastList data={weather.forecast} unit={settings.units} theme={settings.theme} />
                      </div>
                    );
                  case 'chart':
                    return (
                      <div key="chart" className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 h-[350px]">
                        <ForecastChart data={weather.hourly} unit={settings.units} theme={settings.theme} />
                      </div>
                    );
                  default:
                    return null;
                }
              })}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
              <Skeleton className="h-[400px] w-full rounded-[2.5rem] bg-white/5" />
              <Skeleton className="h-[500px] w-full rounded-[2.5rem] bg-white/5" />
            </div>
            <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
              <Skeleton className="h-[200px] w-full rounded-[2.5rem] bg-white/5" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-3xl bg-white/5" />
                ))}
              </div>
              <Skeleton className="h-[400px] w-full rounded-[2.5rem] bg-white/5" />
            </div>
          </div>
        )}

        <SettingsModal 
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          settings={settings}
          onSave={setSettings}
        />
      </div>
    </div>
  );
};

export default App;
