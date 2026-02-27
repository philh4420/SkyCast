import React from 'react';

interface SunDialProps {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  isDark: boolean;
}

export const SunDial: React.FC<SunDialProps> = ({ sunrise, sunset, moonrise, moonset, isDark }) => {
  const parseTime = (timeStr: string) => {
    if (!timeStr) return null;
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
  };

  const getRotation = (timeStr: string) => {
    const time = parseTime(timeStr);
    if (!time) return 0;
    const totalMinutes = time.hours * 60 + time.minutes;
    return (totalMinutes / 1440) * 360; // 1440 minutes in a day
  };

  const textColor = isDark ? 'text-white' : 'text-slate-800';
  const trackColor = isDark ? 'border-white/10' : 'border-slate-200';
  const sunColor = isDark ? 'bg-yellow-400' : 'bg-yellow-500';
  const moonColor = isDark ? 'bg-slate-300' : 'bg-slate-400';

  return (
    <div className={`w-full aspect-square rounded-full border-2 ${trackColor} relative flex items-center justify-center`}>
      {/* Sun Arc */}
      <div className="absolute inset-0" style={{ transform: `rotate(${getRotation(sunrise)}deg)` }}>
        <div className={`absolute w-4 h-4 rounded-full ${sunColor} -translate-x-1/2 -translate-y-1/2 top-1/2 left-0`}></div>
      </div>
      <div className="absolute inset-0" style={{ transform: `rotate(${getRotation(sunset)}deg)` }}>
        <div className={`absolute w-4 h-4 rounded-full ${sunColor} -translate-x-1/2 -translate-y-1/2 top-1/2 left-0`}></div>
      </div>

      {/* Moon Arc */}
      <div className="absolute inset-0" style={{ transform: `rotate(${getRotation(moonrise)}deg)` }}>
        <div className={`absolute w-3 h-3 rounded-full ${moonColor} -translate-x-1/2 -translate-y-1/2 top-1/2 left-0`}></div>
      </div>
      <div className="absolute inset-0" style={{ transform: `rotate(${getRotation(moonset)}deg)` }}>
        <div className={`absolute w-3 h-3 rounded-full ${moonColor} -translate-x-1/2 -translate-y-1/2 top-1/2 left-0`}></div>
      </div>

      <div className={`text-center ${textColor}`}>
        <div className="text-xs opacity-60">Sunrise</div>
        <div className="text-lg font-bold">{sunrise}</div>
        <div className="text-xs opacity-60 mt-2">Sunset</div>
        <div className="text-lg font-bold">{sunset}</div>
      </div>
    </div>
  );
};
