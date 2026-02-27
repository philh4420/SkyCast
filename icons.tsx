import React from 'react';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, Moon, CloudSun, Wind } from 'lucide-react';
import { motion } from 'motion/react';

interface WeatherIconProps {
  code: string;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ code, className = "w-full h-full" }) => {
  const iconProps = { className };

  const getIcon = () => {
    switch (code) {
      case 'clear-day':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          >
            <Sun {...iconProps} className={`${className} text-yellow-400`} />
          </motion.div>
        );
      case 'clear-night':
        return (
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Moon {...iconProps} className={`${className} text-blue-200`} />
          </motion.div>
        );
      case 'partly-cloudy-day':
        return (
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <CloudSun {...iconProps} className={`${className} text-orange-300`} />
          </motion.div>
        );
      case 'partly-cloudy-night':
        return (
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <CloudSun {...iconProps} className={`${className} text-gray-400`} />
          </motion.div>
        );
      case 'cloudy':
        return (
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Cloud {...iconProps} className={`${className} text-gray-300`} />
          </motion.div>
        );
      case 'rain':
        return (
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <CloudRain {...iconProps} className={`${className} text-blue-400`} />
          </motion.div>
        );
      case 'drizzle':
        return (
          <motion.div
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <CloudDrizzle {...iconProps} className={`${className} text-blue-300`} />
          </motion.div>
        );
      case 'thunderstorm':
        return (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
          >
            <CloudLightning {...iconProps} className={`${className} text-purple-400`} />
          </motion.div>
        );
      case 'snow':
        return (
          <motion.div
            animate={{ y: [0, 5, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <CloudSnow {...iconProps} className={`${className} text-white`} />
          </motion.div>
        );
      case 'mist':
      case 'fog':
        return (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <CloudFog {...iconProps} className={`${className} text-gray-400`} />
          </motion.div>
        );
      case 'wind':
        return (
          <motion.div
            animate={{ x: [0, 15, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Wind {...iconProps} className={`${className} text-teal-300`} />
          </motion.div>
        );
      default:
        return <Cloud {...iconProps} className={`${className} text-gray-300`} />;
    }
  };

  return getIcon();
};

// Keep for backward compatibility if needed, but we'll try to replace usages
export const WEATHER_ICONS: Record<string, React.ReactNode> = {
  'clear-day': <Sun className="w-full h-full text-yellow-400" />,
  'clear-night': <Moon className="w-full h-full text-blue-200" />,
  'partly-cloudy-day': <CloudSun className="w-full h-full text-orange-300" />,
  'partly-cloudy-night': <CloudSun className="w-full h-full text-gray-400" />,
  'cloudy': <Cloud className="w-full h-full text-gray-300" />,
  'rain': <CloudRain className="w-full h-full text-blue-400" />,
  'drizzle': <CloudDrizzle className="w-full h-full text-blue-300" />,
  'thunderstorm': <CloudLightning className="w-full h-full text-purple-400" />,
  'snow': <CloudSnow className="w-full h-full text-white" />,
  'mist': <CloudFog className="w-full h-full text-gray-400" />,
  'fog': <CloudFog className="w-full h-full text-gray-400" />,
  'wind': <Wind className="w-full h-full text-teal-300" />,
};
