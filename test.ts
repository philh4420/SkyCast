import dotenv from 'dotenv';

dotenv.config({ path: '.env.example' });

async function test() {
  const lat = 51.723220963875995;
  const lon = -0.34011974238420023;
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,pressure_msl,cloud_cover,visibility,dew_point_2m,soil_temperature_0cm&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,sunrise,sunset,uv_index_max,wind_speed_10m_max,wind_direction_10m_dominant&hourly=temperature_2m,weather_code,relative_humidity_2m,apparent_temperature,precipitation_probability,wind_speed_10m,wind_direction_10m,visibility,uv_index&timezone=auto&forecast_days=10`;
  
  try {
    const res = await fetch(weatherUrl);
    console.log("Status:", res.status);
    if (!res.ok) {
        console.log("Error:", await res.text());
    }
  } catch (e) {
    console.error("Fetch Error:", e);
  }
}

test();
