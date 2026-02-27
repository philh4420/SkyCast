import { getWeather } from './api/_shared/services/weatherService';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.example' });

async function test() {
  try {
    const data = await getWeather(51.723220963875995, -0.34011974238420023);
    console.log("Success:", Object.keys(data));
  } catch (e) {
    console.error("Error:", e);
  }
}

test();
