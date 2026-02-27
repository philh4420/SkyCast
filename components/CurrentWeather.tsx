
import React from 'react';
import { WeatherData } from '../types';

interface CurrentWeatherProps {
  data: WeatherData;
  unit: 'metric' | 'imperial';
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, unit }) => {
  const { current, location, forecast } = data;
  
  // Basic Values
  const temp = Math.round(current.temp);
  const high = Math.round(forecast[0]?.tempMax ?? current.temp);
  const low = Math.round(forecast[0]?.tempMin ?? current.temp);

  return (
    <div className="flex flex-col items-center justify-center text-center py-12 md:py-20 relative z-10">
        {/* City Name with subtle shadow */}
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight drop-shadow-lg mb-4 text-white/90">
          {location.city}
        </h2>
        
        {/* Massive Temperature Display */}
        <div className="relative flex items-center justify-center">
            <span className="text-[8rem] md:text-[11rem] leading-none font-thin tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-2xl select-none">
                {temp}°
            </span>
        </div>
        
        {/* Condition Text */}
        <div className="text-xl md:text-3xl font-medium capitalize text-white/90 drop-shadow-md mt-4 tracking-wide">
            {current.description}
        </div>
        
        {/* High / Low */}
        <div className="flex items-center gap-6 text-lg md:text-xl font-medium text-white/80 mt-3 tracking-wider">
            <span className="drop-shadow-sm">H:{high}°</span>
            <span className="drop-shadow-sm">L:{low}°</span>
        </div>
    </div>
  );
};
