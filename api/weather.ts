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
  } catch (error: any) {
    console.error('Weather API Error:', error);
    // Ensure we always return JSON, even if it's a 500
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ 
      error: 'Failed to fetch weather data',
      details: error.message || String(error)
    });
  }
}
