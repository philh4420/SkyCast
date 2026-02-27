import React from 'react';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, Moon, CloudSun, Wind, Eye, Gauge, Umbrella, Navigation, Sunrise, Thermometer, Droplets, Layers, Activity, ShieldCheck, Leaf, Sprout, Flower } from 'lucide-react';
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

interface UtilityIconProps {
  type: 'uv' | 'sunrise' | 'wind' | 'rain' | 'feels-like' | 'humidity' | 'visibility' | 'pressure' | 'moon' | 'cloud' | 'soil' | 'averages';
  className?: string;
}

export const UtilityIcon: React.FC<UtilityIconProps> = ({ type, className = "w-full h-full" }) => {
  const iconProps = { className };

  switch (type) {
    case 'uv':
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Sun {...iconProps} className={`${className} text-yellow-500`} />
        </motion.div>
      );
    case 'sunrise':
      return (
        <motion.div
          animate={{ y: [2, -2, 2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sunrise {...iconProps} className={`${className} text-orange-400`} />
        </motion.div>
      );
    case 'wind':
      return (
        <motion.div
          animate={{ x: [-2, 2, -2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Wind {...iconProps} className={`${className} text-blue-300`} />
        </motion.div>
      );
    case 'rain':
      return (
        <motion.div
          animate={{ y: [-1, 1, -1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Umbrella {...iconProps} className={`${className} text-blue-400`} />
        </motion.div>
      );
    case 'feels-like':
      return (
        <motion.div
          animate={{ scaleY: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Thermometer {...iconProps} className={`${className} text-red-400`} />
        </motion.div>
      );
    case 'humidity':
      return (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Droplets {...iconProps} className={`${className} text-blue-500`} />
        </motion.div>
      );
    case 'visibility':
      return (
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Eye {...iconProps} className={`${className} text-teal-400`} />
        </motion.div>
      );
    case 'pressure':
      return (
        <motion.div
          animate={{ rotate: [-10, 10, -10] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Gauge {...iconProps} className={`${className} text-purple-400`} />
        </motion.div>
      );
    case 'moon':
      return (
        <motion.div
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Moon {...iconProps} className={`${className} text-indigo-300`} />
        </motion.div>
      );
    case 'cloud':
      return (
        <motion.div
          animate={{ x: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Cloud {...iconProps} className={`${className} text-gray-400`} />
        </motion.div>
      );
    case 'soil':
      return (
        <motion.div
          animate={{ y: [1, -1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Layers {...iconProps} className={`${className} text-amber-600`} />
        </motion.div>
      );
    case 'averages':
      return (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Activity {...iconProps} className={`${className} text-green-400`} />
        </motion.div>
      );
    default:
      return <Activity {...iconProps} />;
  }
};

interface PollutantIconProps {
  type: 'shield' | 'leaf' | 'sprout' | 'flower';
  className?: string;
}

export const PollutantIcon: React.FC<PollutantIconProps> = ({ type, className = "w-full h-full" }) => {
  const iconProps = { className };

  switch (type) {
    case 'shield':
      return (
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ShieldCheck {...iconProps} className={`${className} text-emerald-400`} />
        </motion.div>
      );
    case 'leaf':
      return (
        <motion.div
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Leaf {...iconProps} className={`${className} text-green-400`} />
        </motion.div>
      );
    case 'sprout':
      return (
        <motion.div
          animate={{ y: [1, -1, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sprout {...iconProps} className={`${className} text-lime-400`} />
        </motion.div>
      );
    case 'flower':
      return (
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Flower {...iconProps} className={`${className} text-pink-400`} />
        </motion.div>
      );
    default:
      return <ShieldCheck {...iconProps} />;
  }
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
