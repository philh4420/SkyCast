
import { WeatherData, DailyForecast, HourlyForecast, AirQualityData, WeatherAlert } from '../types';
import { WMO_CODE_MAP } from '../constants';

interface PartialWeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  windDir?: number;
  windGust?: number;
  feelsLike: number;
  dewPoint?: number;
  pressure: number;
  condition: string;
  description: string;
  iconCode: string;
  uvIndex?: number;
  visibility?: number;
  cloudCover?: number;
  sunrise?: string;
  sunset?: string;
  moonrise?: string;
  moonset?: string;
  moonIllumination?: number;
  soilTemp?: number;
  forecast?: DailyForecast[];
  hourly?: HourlyForecast[];
  alerts?: WeatherAlert[];
  city?: string;
  country?: string;
  aqi?: number;
  airQuality?: AirQualityData;
}

// Helper to format time
const formatTime = (isoString: string) => {
  try {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return isoString;
  }
};

// --- Open-Meteo (Base + AQI) ---
const fetchOpenMeteo = async (lat: number, lon: number): Promise<PartialWeatherData> => {
  // Added: forecast_days=10, daily wind/gusts, soil temp, precip sum
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,pressure_msl,cloud_cover,visibility,dew_point_2m,soil_temperature_0cm&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,sunrise,sunset,uv_index_max,wind_speed_10m_max,wind_direction_10m_dominant&hourly=temperature_2m,weather_code,relative_humidity_2m,apparent_temperature,precipitation_probability,wind_speed_10m,wind_direction_10m,visibility,uv_index&timezone=auto&forecast_days=10`;
  
  // Expanded AQI URL to include pollutants and pollen
  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&hourly=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&timezone=auto`;

  const [weatherRes, aqiRes] = await Promise.all([
    fetch(weatherUrl),
    fetch(aqiUrl)
  ]);

  if (!weatherRes.ok) {
    const text = await weatherRes.text();
    throw new Error(`Open-Meteo Failed: ${weatherRes.status} ${text}`);
  }
  
  let data;
  try {
    data = await weatherRes.json();
  } catch (e) {
    const text = await weatherRes.text();
    throw new Error(`Open-Meteo Invalid JSON: ${text.substring(0, 100)}`);
  }
  
  if (!data || !data.current || !data.daily || !data.hourly) {
    throw new Error('Open-Meteo Invalid Data Structure');
  }
  
  let aqi = undefined;
  let airQuality: AirQualityData | undefined = undefined;
  
  if (aqiRes.ok) {
    const aqiData = await aqiRes.json();
    aqi = aqiData.current?.us_aqi;
    
    // Process Detailed Air Quality
    if (aqiData.current && aqiData.hourly) {
        // Pollen is hourly, find closest hour to now
        const now = new Date();
        const hourIndex = aqiData.hourly.time.findIndex((t: string) => {
            const time = new Date(t);
            return Math.abs(time.getTime() - now.getTime()) < 3600000; // Within 1 hour
        }) || 0;

        airQuality = {
            pm2_5: aqiData.current.pm2_5,
            pm10: aqiData.current.pm10,
            no2: aqiData.current.nitrogen_dioxide,
            o3: aqiData.current.ozone,
            so2: aqiData.current.sulphur_dioxide,
            co: aqiData.current.carbon_monoxide,
            pollen: {
                grass: aqiData.hourly.grass_pollen?.[hourIndex] || 0,
                // Combine trees
                tree: Math.max(aqiData.hourly.alder_pollen?.[hourIndex] || 0, aqiData.hourly.birch_pollen?.[hourIndex] || 0),
                // Combine weeds
                weed: Math.max(aqiData.hourly.mugwort_pollen?.[hourIndex] || 0, aqiData.hourly.ragweed_pollen?.[hourIndex] || 0),
                olive: aqiData.hourly.olive_pollen?.[hourIndex] || 0
            }
        };
    }
  }

  // Geo
  let geoData: any = {};
  try {
    const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    if (geoRes.ok) {
      geoData = await geoRes.json();
    }
  } catch (e) {
    console.warn('Geocoding failed:', e);
  }

  const currentCode = WMO_CODE_MAP[data.current.weather_code] || 'cloudy';
  const isDay = data.current.is_day === 1;

  // Compute daily humidity from hourly
  const dailyHumidityMap = new Map<string, number>();
  if (data.hourly && data.hourly.relative_humidity_2m) {
     const tempMap = new Map<string, number[]>();
     data.hourly.time.forEach((t: string, i: number) => {
        const day = t.split('T')[0];
        if (!tempMap.has(day)) tempMap.set(day, []);
        tempMap.get(day)!.push(data.hourly.relative_humidity_2m[i]);
     });
     tempMap.forEach((vals, day) => {
        const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
        dailyHumidityMap.set(day, Math.round(avg));
     });
  }

  const forecast: DailyForecast[] = data.daily.time.map((time: string, index: number) => ({
    date: time,
    tempMax: data.daily.temperature_2m_max[index],
    tempMin: data.daily.temperature_2m_min[index],
    condition: (WMO_CODE_MAP[data.daily.weather_code[index]] || 'cloudy').replace(/-/g, ' '),
    iconCode: WMO_CODE_MAP[data.daily.weather_code[index]] || 'cloudy',
    precipitationProb: data.daily.precipitation_probability_max[index],
    totalPrecip: data.daily.precipitation_sum[index],
    uvIndex: data.daily.uv_index_max[index],
    sunrise: formatTime(data.daily.sunrise[index]),
    sunset: formatTime(data.daily.sunset[index]),
    windSpeed: data.daily.wind_speed_10m_max[index],
    windDir: data.daily.wind_direction_10m_dominant[index],
    humidity: dailyHumidityMap.get(time),
  }));

  const hourly: HourlyForecast[] = data.hourly.time.slice(0, 48).map((time: string, index: number) => ({
    time: time,
    temp: data.hourly.temperature_2m[index],
    feelsLike: data.hourly.apparent_temperature[index],
    humidity: data.hourly.relative_humidity_2m[index],
    windSpeed: data.hourly.wind_speed_10m[index],
    windDir: data.hourly.wind_direction_10m[index],
    precipProb: data.hourly.precipitation_probability[index],
    uvIndex: data.hourly.uv_index[index],
    iconCode: WMO_CODE_MAP[data.hourly.weather_code[index]] || 'cloudy',
    condition: (WMO_CODE_MAP[data.hourly.weather_code[index]] || '').replace(/-/g, ' ')
  }));

  return {
    temp: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    windDir: data.current.wind_direction_10m,
    windGust: data.current.wind_gusts_10m,
    feelsLike: data.current.apparent_temperature,
    dewPoint: data.current.dew_point_2m,
    pressure: data.current.pressure_msl,
    condition: currentCode.replace(/-/g, ' '),
    description: "Current conditions",
    iconCode: isDay ? currentCode : (currentCode === 'clear-day' ? 'clear-night' : currentCode),
    visibility: data.current.visibility ? data.current.visibility / 1000 : undefined,
    cloudCover: data.current.cloud_cover,
    soilTemp: data.current.soil_temperature_0cm,
    forecast,
    hourly,
    city: geoData.city || geoData.locality || "Unknown",
    country: geoData.countryName || "",
    aqi,
    airQuality,
    sunrise: formatTime(data.daily.sunrise?.[0] || ''),
    sunset: formatTime(data.daily.sunset?.[0] || ''),
  };
};

// --- 7Timer! (Free Fallback) ---
const fetch7Timer = async (lat: number, lon: number): Promise<PartialWeatherData> => {
  const res = await fetch(`https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`7Timer Failed: ${res.status} ${text}`);
  }
  const data = await res.json();

  if (!data || !data.init || !data.dataseries) {
    throw new Error('7Timer Invalid Data');
  }

  const initStr = data.init.toString();
  const initYear = parseInt(initStr.substring(0, 4));
  const initMonth = parseInt(initStr.substring(4, 6)) - 1;
  const initDay = parseInt(initStr.substring(6, 8));
  const initHour = parseInt(initStr.substring(8, 10));
  const initDate = new Date(Date.UTC(initYear, initMonth, initDay, initHour));

  const hourly: HourlyForecast[] = [];
  const dailyMap = new Map<string, { 
    min: number, max: number, weather: string, 
    windSums: number, windCount: number,
    humSums: number, humCount: number 
  }>();

  data.dataseries.forEach((item: any) => {
    const time = new Date(initDate.getTime() + item.timepoint * 3600 * 1000);
    const dateStr = time.toISOString().split('T')[0];

    let iconCode = 'cloudy';
    let condition = item.weather;
    const w = item.weather;
    if (w === 'clear') iconCode = 'clear-day';
    else if (w === 'pcloudy') iconCode = 'partly-cloudy-day';
    else if (w === 'mcloudy' || w === 'cloudy') iconCode = 'cloudy';
    else if (w.includes('rain') || w.includes('shower')) iconCode = 'rain';
    else if (w.includes('snow')) iconCode = 'snow';
    else if (w.includes('ts')) iconCode = 'thunderstorm';

    const windApprox = [0, 2, 6, 9, 12, 16, 20, 25, 30][Math.min(item.wind10m.speed, 8)] * 3.6;

    let humidity = 60;
    if (typeof item.rh2m === 'string') humidity = parseInt(item.rh2m.replace('%', ''));
    else if (typeof item.rh2m === 'number') humidity = item.rh2m; 

    hourly.push({
      time: time.toISOString(),
      temp: item.temp2m,
      feelsLike: item.temp2m,
      humidity,
      windSpeed: windApprox,
      precipProb: w.includes('rain') || w.includes('snow') ? 60 : 0, 
      iconCode,
      condition
    });
    
    if (!dailyMap.has(dateStr)) {
        dailyMap.set(dateStr, { 
            min: item.temp2m, max: item.temp2m, weather: condition,
            windSums: windApprox, windCount: 1,
            humSums: humidity, humCount: 1
        });
    } else {
        const d = dailyMap.get(dateStr)!;
        d.min = Math.min(d.min, item.temp2m);
        d.max = Math.max(d.max, item.temp2m);
        d.windSums += windApprox;
        d.windCount++;
        d.humSums += humidity;
        d.humCount++;
    }
  });

  const now = new Date();
  const current = hourly.reduce((prev, curr) => 
    Math.abs(new Date(curr.time).getTime() - now.getTime()) < Math.abs(new Date(prev.time).getTime() - now.getTime()) ? curr : prev
  );

  const forecast: DailyForecast[] = Array.from(dailyMap.entries()).map(([date, val]) => ({
      date,
      tempMax: val.max,
      tempMin: val.min,
      condition: val.weather,
      iconCode: 'cloudy',
      precipitationProb: 0,
      windSpeed: val.windSums / val.windCount,
      humidity: Math.round(val.humSums / val.humCount)
  })).slice(0,8); // Get up to 8 days

  return {
      temp: current.temp,
      humidity: current.humidity,
      windSpeed: current.windSpeed,
      feelsLike: current.feelsLike,
      pressure: 1013,
      condition: current.condition || 'Cloudy',
      description: current.condition || 'Cloudy',
      iconCode: current.iconCode,
      forecast,
      hourly,
      city: '',
      country: ''
  };
};

// --- OpenWeatherMap ---
const fetchOpenWeatherMap = async (lat: number, lon: number, apiKey: string): Promise<PartialWeatherData> => {
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  const res = await fetch(currentUrl);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OWM Failed: ${res.status} ${text}`);
  }
  const currentData = await res.json();

  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  const forecastRes = await fetch(forecastUrl);
  let forecast: DailyForecast[] = [];
  let hourly: HourlyForecast[] = [];
  
  const mapIcon = (code: string) => {
    if (code.startsWith('01')) return code.endsWith('d') ? 'clear-day' : 'clear-night';
    if (code.startsWith('02')) return code.endsWith('d') ? 'partly-cloudy-day' : 'partly-cloudy-night';
    if (code.startsWith('03') || code.startsWith('04')) return 'cloudy';
    if (code.startsWith('09') || code.startsWith('10')) return 'rain';
    if (code.startsWith('11')) return 'thunderstorm';
    if (code.startsWith('13')) return 'snow';
    if (code.startsWith('50')) return 'mist';
    return 'cloudy';
  };

  if (forecastRes.ok) {
      const forecastData = await forecastRes.json();
      const dailyMap = new Map<string, DailyForecast & { windSum: number, count: number, humSum: number }>();
      
      forecastData.list.forEach((item: any) => {
        const date = item.dt_txt.split(' ')[0];
        const speed = item.wind.speed * 3.6;
        const hum = item.main.humidity;
        
        if (!dailyMap.has(date)) {
          dailyMap.set(date, {
            date,
            tempMax: item.main.temp_max,
            tempMin: item.main.temp_min,
            condition: item.weather[0].main,
            iconCode: mapIcon(item.weather[0].icon),
            precipitationProb: item.pop * 100,
            windSum: speed,
            humSum: hum,
            count: 1
          });
        } else {
          const existing = dailyMap.get(date)!;
          existing.tempMax = Math.max(existing.tempMax, item.main.temp_max);
          existing.tempMin = Math.min(existing.tempMin, item.main.temp_min);
          existing.windSum += speed;
          existing.humSum += hum;
          existing.count++;
          // Approx max precip chance
          existing.precipitationProb = Math.max(existing.precipitationProb!, item.pop * 100);
        }

        hourly.push({
            time: new Date(item.dt * 1000).toISOString(),
            temp: item.main.temp,
            feelsLike: item.main.feels_like,
            humidity: item.main.humidity,
            windSpeed: speed,
            windDir: item.wind.deg,
            precipProb: item.pop * 100,
            iconCode: mapIcon(item.weather[0].icon),
            condition: item.weather[0].main
        });
      });
      
      forecast = Array.from(dailyMap.values()).map(d => ({
          ...d,
          windSpeed: d.windSum / d.count,
          humidity: Math.round(d.humSum / d.count)
      }));
  }

  return {
    temp: currentData.main.temp,
    humidity: currentData.main.humidity,
    windSpeed: currentData.wind.speed * 3.6,
    windDir: currentData.wind.deg,
    windGust: currentData.wind.gust ? currentData.wind.gust * 3.6 : undefined, // OWM Gust is in m/s
    feelsLike: currentData.main.feels_like,
    pressure: currentData.main.pressure,
    condition: currentData.weather[0].main,
    description: currentData.weather[0].description,
    iconCode: mapIcon(currentData.weather[0].icon),
    visibility: currentData.visibility / 1000,
    cloudCover: currentData.clouds.all,
    city: currentData.name,
    country: currentData.sys.country,
    sunrise: new Date(currentData.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    sunset: new Date(currentData.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    forecast,
    hourly
  };
};

// --- WeatherAPI.com ---
const fetchWeatherAPI = async (lat: number, lon: number, apiKey: string): Promise<PartialWeatherData> => {
  // Try requesting 8 days, with alerts
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=8&aqi=yes&alerts=yes`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`WeatherAPI Failed: ${res.status} ${text}`);
  }
  const data = await res.json();

  const mapCodeToIcon = (code: number, isDay: number) => {
    if (code === 1000) return isDay ? 'clear-day' : 'clear-night';
    if (code === 1003) return isDay ? 'partly-cloudy-day' : 'partly-cloudy-night';
    if ([1006, 1009].includes(code)) return 'cloudy';
    if ([1030, 1135, 1147].includes(code)) return 'fog';
    if ([1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code)) return 'rain';
    if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code)) return 'snow';
    if ([1087, 1273, 1276, 1279, 1282].includes(code)) return 'thunderstorm';
    return 'cloudy';
  };

  const forecast: DailyForecast[] = data.forecast.forecastday.map((day: any) => ({
    date: day.date,
    tempMax: day.day.maxtemp_c,
    tempMin: day.day.mintemp_c,
    condition: day.day.condition.text,
    iconCode: mapCodeToIcon(day.day.condition.code, 1),
    precipitationProb: day.day.daily_chance_of_rain,
    totalPrecip: day.day.totalprecip_mm,
    uvIndex: day.day.uv,
    moonPhase: day.astro.moon_phase,
    sunrise: day.astro.sunrise,
    sunset: day.astro.sunset,
    windSpeed: day.day.maxwind_kph,
    humidity: day.day.avghumidity
  }));

  let hourly: HourlyForecast[] = [];
  data.forecast.forecastday.forEach((day: any) => {
    day.hour.forEach((h: any) => {
      hourly.push({
        time: new Date(h.time).toISOString(),
        temp: h.temp_c,
        feelsLike: h.feelslike_c,
        humidity: h.humidity,
        windSpeed: h.wind_kph,
        windDir: h.wind_degree,
        precipProb: h.chance_of_rain,
        uvIndex: h.uv,
        iconCode: mapCodeToIcon(h.condition.code, h.is_day),
        condition: h.condition.text
      });
    });
  });
  
  // Normalize WeatherAPI AQI keys to match our internal standard
  const aqData = data.current.air_quality ? {
      pm2_5: data.current.air_quality.pm2_5,
      pm10: data.current.air_quality.pm10,
      no2: data.current.air_quality.no2,
      o3: data.current.air_quality.o3,
      so2: data.current.air_quality.so2,
      co: data.current.air_quality.co,
      pollen: { grass: 0, tree: 0, weed: 0, olive: 0 } // WeatherAPI Free doesn't do pollen well
  } : undefined;

  let alerts;
  if (data.alerts && data.alerts.alert && data.alerts.alert.length > 0) {
      alerts = data.alerts.alert.map((a: any) => ({
          headline: a.headline,
          severity: a.severity,
          urgency: a.urgency,
          areas: a.areas,
          desc: a.desc,
          instruction: a.instruction
      }));
  }

  return {
    temp: data.current.temp_c,
    humidity: data.current.humidity,
    windSpeed: data.current.wind_kph,
    windDir: data.current.wind_degree,
    windGust: data.current.gust_kph,
    dewPoint: data.current.dewpoint_c,
    feelsLike: data.current.feelslike_c,
    pressure: data.current.pressure_mb,
    condition: data.current.condition.text,
    description: data.current.condition.text,
    iconCode: mapCodeToIcon(data.current.condition.code, data.current.is_day),
    uvIndex: data.current.uv,
    visibility: data.current.vis_km,
    cloudCover: data.current.cloud,
    aqi: data.current.air_quality?.['us-epa-index'], 
    airQuality: aqData,
    forecast,
    hourly,
    alerts,
    city: data.location.name,
    country: data.location.country,
    sunrise: data.forecast.forecastday[0].astro.sunrise,
    sunset: data.forecast.forecastday[0].astro.sunset,
    moonrise: data.forecast.forecastday[0].astro.moonrise,
    moonset: data.forecast.forecastday[0].astro.moonset,
    moonIllumination: data.forecast.forecastday[0].astro.moon_illumination,
  };
};

export const getWeather = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  
  const sources: string[] = ['Open-Meteo'];
  const promises: Promise<PartialWeatherData>[] = [fetchOpenMeteo(lat, lon)];
  
  promises.push(fetch7Timer(lat, lon).then(d => { sources.push('7Timer!'); return d; }));

  const owmApiKey = process.env.OWM_API_KEY || process.env.VITE_OWM_API_KEY;
  const weatherApiKey = process.env.WEATHER_API_KEY || process.env.VITE_WEATHER_API_KEY;

  if (owmApiKey) {
    promises.push(fetchOpenWeatherMap(lat, lon, owmApiKey).then(d => { sources.push('OpenWeatherMap'); return d; }));
  }
  if (weatherApiKey) {
    promises.push(fetchWeatherAPI(lat, lon, weatherApiKey).then(d => { sources.push('WeatherAPI'); return d; }));
  }

  const results = await Promise.allSettled(promises);
  
  const successfulData = results
    .filter(r => r.status === 'fulfilled')
    .map(r => (r as PromiseFulfilledResult<PartialWeatherData>).value);

  const failedData = results
    .filter(r => r.status === 'rejected')
    .map(r => (r as PromiseRejectedResult).reason);

  if (successfulData.length === 0) {
    console.error("All weather services failed. Errors:", failedData);
    throw new Error("All weather services failed.");
  }

  // --- ENSEMBLE MERGE LOGIC ---
  const omData = successfulData.find(d => d.forecast && d.forecast.length >= 7) || successfulData[0]; 
  const waData = successfulData.find(d => d.forecast && d.forecast[0].moonPhase); 
  const owmData = successfulData.find(d => d.description && (!d.forecast || d.forecast.length < 7));

  // 1. Daily Forecast Merge
  const baseForecast = omData.forecast || [];
  const enhancedForecast = baseForecast.map(day => {
    const waDay = waData?.forecast?.find(d => d.date === day.date);
    const owmDay = owmData?.forecast?.find(d => d.date === day.date);
    
    // Merge fields
    const condition = waDay?.condition || owmDay?.condition || day.condition;
    const iconCode = waDay?.iconCode || owmDay?.iconCode || day.iconCode;
    const moonPhase = waDay?.moonPhase || day.moonPhase;
    const uvIndex = waDay?.uvIndex !== undefined ? waDay.uvIndex : day.uvIndex;
    const totalPrecip = waDay?.totalPrecip !== undefined ? waDay.totalPrecip : day.totalPrecip;
    
    // Prefer WeatherAPI wind/humidity if available, else OpenMeteo
    const windSpeed = waDay?.windSpeed ?? day.windSpeed;
    const humidity = waDay?.humidity ?? day.humidity;
    
    return { ...day, condition, iconCode, moonPhase, uvIndex, totalPrecip, windSpeed, humidity };
  });

  // 2. Hourly Forecast Merge
  const getHourKey = (iso: string) => {
    const d = new Date(iso);
    d.setMinutes(0,0,0);
    return d.toISOString();
  };

  const now = new Date();
  const hourlyMap = new Map<string, HourlyForecast>();

  if (omData.hourly) {
    omData.hourly.forEach(h => {
       const key = getHourKey(h.time);
       if (new Date(key) >= new Date(now.setMinutes(0,0,0))) {
         hourlyMap.set(key, { ...h });
       }
    });
  }

  successfulData.forEach(sourceData => {
      if (sourceData === omData) return;
      if (!sourceData.hourly) return;

      sourceData.hourly.forEach(h => {
          const key = getHourKey(h.time);
          if (hourlyMap.has(key)) {
            const existing = hourlyMap.get(key)!;
            existing.temp = (existing.temp + h.temp) / 2;
            if (h.feelsLike) existing.feelsLike = (existing.feelsLike + h.feelsLike) / 2;
            if (h.humidity) existing.humidity = (existing.humidity + h.humidity) / 2;
            if (h.windSpeed) existing.windSpeed = (existing.windSpeed + h.windSpeed) / 2;
            if (h.windDir !== undefined && existing.windDir === undefined) existing.windDir = h.windDir; 
            
            existing.precipProb = Math.max(existing.precipProb, h.precipProb);
            
            if (h.uvIndex !== undefined) {
               if (existing.uvIndex === undefined) existing.uvIndex = h.uvIndex;
               else existing.uvIndex = Math.max(existing.uvIndex, h.uvIndex);
            }

            if (existing.iconCode === 'cloudy' && h.iconCode !== 'cloudy') existing.iconCode = h.iconCode;
          }
      });
  });

  const ensembleHourly = Array.from(hourlyMap.values())
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
    .slice(0, 24);

  // 3. Current Conditions Averaging
  const avg = (key: keyof PartialWeatherData) => {
    const values = successfulData.map(d => d[key] as number).filter(v => typeof v === 'number');
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  };
  
  const pick = (key: keyof PartialWeatherData) => {
     return successfulData.find(d => d[key] !== undefined)?.[key];
  };

  const bestDescriptive = waData || owmData || omData;
  const aqi = successfulData.find(d => d.aqi !== undefined)?.aqi;
  // Prefer OM data for details as it includes pollen now
  const airQuality = omData.airQuality || waData?.airQuality;
  const alerts = waData?.alerts;

  // 4. Ensemble Weather Condition (Prioritize severe weather if any API reports it)
  const allIconCodes = successfulData.map(d => d.iconCode).filter(Boolean) as string[];
  const isNight = allIconCodes.some(c => c.includes('night'));
  const suffix = isNight ? '-night' : '-day';

  let ensembleIconCode = 'clear-day';
  if (allIconCodes.some(c => c.includes('thunder'))) ensembleIconCode = 'thunderstorm';
  else if (allIconCodes.some(c => c.includes('snow'))) ensembleIconCode = 'snow';
  else if (allIconCodes.some(c => c.includes('rain') || c.includes('drizzle'))) ensembleIconCode = 'rain';
  else if (allIconCodes.some(c => c.includes('fog') || c.includes('mist'))) ensembleIconCode = 'fog';
  else if (allIconCodes.some(c => c === 'cloudy')) ensembleIconCode = 'cloudy';
  else if (allIconCodes.some(c => c.includes('partly-cloudy'))) ensembleIconCode = `partly-cloudy${suffix}`;
  else ensembleIconCode = `clear${suffix}`;

  const matchingData = successfulData.find(d => {
    if (ensembleIconCode === 'thunderstorm') return d.iconCode?.includes('thunder');
    if (ensembleIconCode === 'snow') return d.iconCode?.includes('snow');
    if (ensembleIconCode === 'rain') return d.iconCode?.includes('rain') || d.iconCode?.includes('drizzle');
    if (ensembleIconCode === 'fog') return d.iconCode?.includes('fog') || d.iconCode?.includes('mist');
    if (ensembleIconCode === 'cloudy') return d.iconCode === 'cloudy';
    if (ensembleIconCode.includes('partly-cloudy')) return d.iconCode?.includes('partly-cloudy');
    return d.iconCode?.includes('clear');
  }) || bestDescriptive;

  return {
    current: {
      temp: avg('temp'),
      humidity: Math.round(avg('humidity')),
      windSpeed: Math.round(avg('windSpeed')),
      windDir: pick('windDir') as number | undefined,
      windGust: Math.round(avg('windGust')),
      feelsLike: avg('feelsLike'),
      dewPoint: Math.round(avg('dewPoint')),
      pressure: Math.round(avg('pressure')),
      condition: matchingData.condition || bestDescriptive.condition,
      description: matchingData.description || bestDescriptive.description,
      iconCode: ensembleIconCode,
      uvIndex: pick('uvIndex') as number | undefined,
      visibility: pick('visibility') as number | undefined,
      cloudCover: pick('cloudCover') as number | undefined,
      soilTemp: pick('soilTemp') as number | undefined,
      aqi,
      airQuality,
      sunrise: bestDescriptive.sunrise,
      sunset: bestDescriptive.sunset,
      moonrise: bestDescriptive.moonrise,
      moonset: bestDescriptive.moonset,
      moonIllumination: bestDescriptive.moonIllumination,
    },
    forecast: enhancedForecast, 
    hourly: ensembleHourly,
    alerts,
    location: {
      city: bestDescriptive.city || "Unknown",
      country: bestDescriptive.country || "",
      lat,
      lon
    },
    sources
  };
};
