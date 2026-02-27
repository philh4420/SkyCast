
import React, { useState, useEffect } from 'react';
import { WeatherData, UserSettings, GeoLocation } from './types';
import { DEFAULT_LAT, DEFAULT_LON } from './constants';
import { CurrentWeather } from './components/CurrentWeather';
import { ForecastChart } from './components/ForecastChart';
import { DailyForecastList } from './components/DailyForecastList';
import { HourlyForecastStrip } from './components/HourlyForecastStrip';
import { PollutionRadar } from './components/PollutionRadar';
import { SettingsModal } from './components/SettingsModal';
import { WeatherMap } from './components/WeatherMap';
import { AlertsBanner } from './components/AlertsBanner';
import { Search, MapPin, Settings, AlertTriangle, CloudLightning, Sparkles, CloudSun, Map } from 'lucide-react';

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('skycast-settings');
    const defaultSettings: UserSettings = {
      units: 'metric'
    };
    if (saved) return { ...defaultSettings, ...JSON.parse(saved) };
    return defaultSettings;
  });

  const [coords, setCoords] = useState<GeoLocation>({ lat: DEFAULT_LAT, lon: DEFAULT_LON });

  useEffect(() => {
    localStorage.setItem('skycast-settings', JSON.stringify(settings));
  }, [settings]);

  const fetchData = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      if (!res.ok) throw new Error('Failed to fetch weather data');
      const data = await res.json();
      setWeather(data);

      fetch(`/api/media?condition=${encodeURIComponent(data.current.condition)}&iconCode=${encodeURIComponent(data.current.iconCode)}`)
        .then(r => r.json())
        .then(mediaData => {
          if (mediaData.videoUrl) setVideoUrl(mediaData.videoUrl);
        })
        .catch(err => console.error('Media fetch error:', err));

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
    if (!weather) return `${base} from-slate-900 to-black`;

    const isNight = code.includes('night');
    if (code.includes('thunder')) return `${base} from-[#1c1c1e] via-[#2c2c2e] to-[#000000]`;
    if (code.includes('rain') || code.includes('drizzle')) return isNight ? `${base} from-[#1c1c1e] via-[#2c2c2e] to-[#000000]` : `${base} from-[#4a5568] via-[#2d3748] to-[#1a202c]`; 
    if (code.includes('snow')) return isNight ? `${base} from-[#1c1c1e] via-[#2d3748] to-[#000000]` : `${base} from-[#e2e8f0] via-[#cbd5e1] to-[#94a3b8]`; 
    if (code.includes('clear')) return isNight ? `${base} from-[#000000] via-[#1c1c1e] to-[#000000]` : `${base} from-[#38bdf8] via-[#0ea5e9] to-[#0284c7]`;
    if (code.includes('cloudy') || code.includes('fog') || code.includes('mist')) return isNight ? `${base} from-[#1c1c1e] via-[#2c2c2e] to-[#000000]` : `${base} from-[#64748b] via-[#475569] to-[#334155]`; 
    return `${base} from-[#1c1c1e] via-[#000000] to-[#000000]`;
  };

  const bgGradient = getAtmosphere(weather?.current.iconCode || '');
  const textColor = weather?.current.iconCode.includes('snow') && !weather?.current.iconCode.includes('night') ? 'text-slate-900' : 'text-white';
  const glassClass = 'bg-black/20 backdrop-blur-3xl border border-white/10 shadow-2xl';
  const inputClass = 'bg-black/20 border-white/10 text-white placeholder-white/50 focus:bg-black/30 focus:border-white/30';

  return (
    <div className={`min-h-screen ${textColor} font-sans relative overflow-x-hidden selection:bg-white/30 bg-black`}>
      
      {/* Video Background */}
      {videoUrl && (
        <div className="fixed inset-0 z-0 transition-opacity duration-1000 ease-in-out opacity-100">
           <video autoPlay loop muted playsInline className="w-full h-full object-cover scale-105 filter brightness-75 contrast-125" key={videoUrl}>
             <source src={videoUrl} type="video/mp4" />
           </video>
        </div>
      )}

      {/* Overlays */}
      <div className={`fixed inset-0 z-0 ${bgGradient} mix-blend-multiply pointer-events-none opacity-80`}></div>
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-0" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 py-8 max-w-[1200px]">
        
        {/* Header / Navbar */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer group select-none" onClick={() => window.location.reload()}>
             <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-500">
                <CloudSun className="w-6 h-6 text-white drop-shadow-md" />
                <div className="absolute inset-0 rounded-xl ring-1 ring-white/20 inset-shadow pointer-events-none"></div>
             </div>
             <div className="flex flex-col">
                <span className="text-xl font-semibold tracking-tight">SkyCast</span>
             </div>
          </div>

          {/* Search & Actions */}
          <div className="flex w-full md:w-auto items-center gap-3">
             <form onSubmit={handleLocationSearch} className="flex-1 md:w-80 relative group z-20">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-white/50 group-focus-within:text-white transition-colors" />
               </div>
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search city..." 
                 className={`w-full ${inputClass} backdrop-blur-3xl border rounded-full pl-11 pr-4 py-2.5 text-sm font-medium focus:outline-none transition-all shadow-inner`}
               />
             </form>

             <button 
               onClick={handleCurrentLocation} 
               className={`p-2.5 ${glassClass} rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all active:scale-95 group`}
               title="Use Current Location"
             >
               <MapPin className="w-5 h-5 group-hover:animate-bounce" />
             </button>
             
             <button 
               onClick={() => setSettingsOpen(true)} 
               className={`p-2.5 ${glassClass} rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all active:scale-95 group`}
               title="Settings"
             >
               <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
             </button>
          </div>
        </header>

        {error && (
          <div className="animate-fade-in bg-red-500/20 border border-red-500/20 p-4 rounded-2xl mb-8 flex items-center justify-center space-x-2 backdrop-blur-md">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {weather && !loading ? (
          <div className="animate-fade-in pb-10 flex flex-col gap-6">
            
            {/* ALERTS */}
            {weather.alerts && <AlertsBanner alerts={weather.alerts} />}

            {/* TOP ROW: CURRENT WEATHER DASHBOARD */}
            <div className="w-full">
               <CurrentWeather data={weather} unit={settings.units} />
            </div>

            {/* CONTENT STACK */}
            <div className="flex flex-col gap-6">
                   
               {/* 2. HOURLY TIMELINE */}
               <div className={`${glassClass} rounded-[2.5rem] p-6 overflow-hidden`}>
                  <HourlyForecastStrip data={weather.hourly} unit={settings.units} sunrise={weather.current.sunrise} sunset={weather.current.sunset} />
               </div>

               {/* 4. 10-DAY FORECAST */}
               <div className="w-full">
                  <DailyForecastList data={weather.forecast} unit={settings.units} />
               </div>

               {/* INTERACTIVE MAP */}
               <div className="w-full">
                  <WeatherMap lat={coords.lat} lon={coords.lon} unit={settings.units} />
               </div>

               {/* 3. POLLUTION RADAR (NEW) */}
               {weather.current.airQuality && (
                   <div className="w-full">
                       <PollutionRadar data={weather.current.airQuality} aqi={weather.current.aqi} />
                   </div>
               )}

               {/* 5. CHART */}
               <div className={`${glassClass} rounded-[2.5rem] p-6 h-[300px]`}>
                  <ForecastChart data={weather.hourly} unit={settings.units} />
               </div>

            </div>
          </div>
        ) : (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6 animate-pulse">
            <div className="relative">
               <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
               <CloudLightning className="w-16 h-16 relative z-10" />
            </div>
            <div className="space-y-2">
               <h3 className="text-2xl font-light">Loading Atmosphere</h3>
               <p className="text-sm opacity-60">Connecting to satellite array...</p>
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
