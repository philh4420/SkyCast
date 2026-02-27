import { VercelRequest, VercelResponse } from '@vercel/node';
import { getWeather } from './_shared/services/weatherService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set JSON header immediately to prevent HTML error pages from Vercel if possible
  res.setHeader('Content-Type', 'application/json');

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
    
    // If headers are already sent, we can't do anything
    if (res.headersSent) return;

    res.status(500).json({ 
      error: 'Failed to fetch weather data',
      details: error.message || String(error)
    });
  }
}
