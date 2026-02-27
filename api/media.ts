import { VercelRequest, VercelResponse } from '@vercel/node';
import { getWeatherVideo } from '../services/mediaService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const condition = req.query.condition as string;
    const iconCode = req.query.iconCode as string;
    
    if (!condition || !iconCode) {
      return res.status(400).json({ error: 'Missing condition or iconCode' });
    }

    const videoUrl = await getWeatherVideo(condition, iconCode);
    res.status(200).json({ videoUrl });
  } catch (error) {
    console.error('Media API Error:', error);
    res.status(500).json({ error: 'Failed to fetch media data' });
  }
}
