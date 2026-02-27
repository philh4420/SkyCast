export const DEFAULT_LAT = 40.7128; // NYC
export const DEFAULT_LON = -74.0060;

// Simple mapping from WMO codes (OpenMeteo) to our generic keys
export const WMO_CODE_MAP: Record<number, string> = {
  0: 'clear-day',
  1: 'partly-cloudy-day',
  2: 'partly-cloudy-day',
  3: 'cloudy',
  45: 'fog',
  48: 'fog',
  51: 'drizzle',
  53: 'drizzle',
  55: 'drizzle',
  61: 'rain',
  63: 'rain',
  65: 'rain',
  71: 'snow',
  73: 'snow',
  75: 'snow',
  80: 'rain',
  81: 'rain',
  82: 'rain',
  95: 'thunderstorm',
  96: 'thunderstorm',
  99: 'thunderstorm',
};
