import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { getWeather } from './services/weatherService.js';
import { getWeatherVideo } from './services/mediaService.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get('/api/weather', async (req, res) => {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lon = parseFloat(req.query.lon as string);
      
      if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({ error: 'Invalid coordinates' });
      }

      const data = await getWeather(lat, lon);
      res.json(data);
    } catch (error) {
      console.error('Weather API Error:', error);
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  });

  app.get('/api/media', async (req, res) => {
    try {
      const condition = req.query.condition as string;
      const iconCode = req.query.iconCode as string;
      
      if (!condition || !iconCode) {
        return res.status(400).json({ error: 'Missing condition or iconCode' });
      }

      const videoUrl = await getWeatherVideo(condition, iconCode);
      res.json({ videoUrl });
    } catch (error) {
      console.error('Media API Error:', error);
      res.status(500).json({ error: 'Failed to fetch media data' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
