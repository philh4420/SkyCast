import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import webpush from 'web-push';
import { getWeather } from './services/weatherService.js';
import { getWeatherVideo } from './services/mediaService.js';

dotenv.config();

// Load VAPID keys from environment variables
let vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
let vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@example.com';

if (!vapidPublicKey || !vapidPrivateKey) {
  console.warn('⚠️ VAPID keys are missing from environment variables!');
  console.warn('Generating temporary keys for this session. Push subscriptions will be lost on restart.');
  console.warn('To fix this, run `npx web-push generate-vapid-keys` and add VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY to your environment variables.');
  const keys = webpush.generateVAPIDKeys();
  vapidPublicKey = keys.publicKey;
  vapidPrivateKey = keys.privateKey;
}

webpush.setVapidDetails(
  vapidSubject,
  vapidPublicKey,
  vapidPrivateKey
);

// In-memory store for subscriptions
const subscriptions: any[] = [];

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

  // Web Push Routes
  app.get('/api/push/vapid-public-key', (req, res) => {
    res.json({ publicKey: vapidPublicKey });
  });

  app.post('/api/push/subscribe', (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({});
  });

  app.post('/api/push/send', async (req, res) => {
    const payload = JSON.stringify({
      title: 'SkyCast Weather Alert',
      body: req.body.message || 'Severe weather warning in your area!',
      icon: '/icon-192x192.png'
    });

    try {
      const promises = subscriptions.map(sub => 
        webpush.sendNotification(sub, payload).catch(err => {
          console.error('Error sending notification, removing subscription', err);
          // Remove invalid subscriptions
          const index = subscriptions.indexOf(sub);
          if (index > -1) subscriptions.splice(index, 1);
        })
      );
      await Promise.all(promises);
      res.status(200).json({ message: 'Notifications sent successfully.' });
    } catch (error) {
      console.error('Error sending push notifications:', error);
      res.status(500).json({ error: 'Failed to send notifications' });
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
    
    // SPA fallback
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
