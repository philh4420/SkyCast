import { VercelRequest, VercelResponse } from '@vercel/node';
import { getWeather } from '../services/weatherService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lon = parseFloat(req.query.lon as string);
    
    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ error: 'Invalid coordinates' });
    }

    const data = await getWeather(lat, lon);
    res.status(200).json(data);
  } catch (error) {
    console.error('Weather API Error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
}
