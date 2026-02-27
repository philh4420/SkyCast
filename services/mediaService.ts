
const getApiKeys = () => {
  const key = import.meta.env.VITE_PEXELS_API_KEY;
  return key ? [key] : [];
};
const BASE_URL = 'https://api.pexels.com/videos/search';

// Mapping weather codes/descriptions to cinematic Pexels search queries
const getQuery = (condition: string, iconCode: string): string => {
  const i = iconCode.toLowerCase();
  const c = condition.toLowerCase();
  const isNight = i.includes('night');

  // Thunderstorm
  if (i.includes('thunder') || c.includes('storm')) {
    return isNight ? 'lightning storm night' : 'thunderstorm dark clouds';
  }

  // Snow
  if (i.includes('snow') || c.includes('snow') || c.includes('blizzard') || c.includes('flurry')) {
    return isNight ? 'snow falling night' : 'snow falling winter landscape';
  }

  // Rain / Drizzle
  if (i.includes('rain') || c.includes('rain') || c.includes('drizzle') || c.includes('shower')) {
    return isNight ? 'rain night city' : 'raining nature landscape';
  }

  // Fog / Mist
  if (i.includes('fog') || i.includes('mist') || c.includes('fog') || c.includes('mist') || c.includes('haze')) {
    return 'foggy landscape nature';
  }

  // Partly Cloudy
  if (i.includes('partly-cloudy')) {
    return isNight ? 'moon clouds night sky' : 'blue sky white clouds';
  }

  // Cloudy / Overcast
  if (i.includes('cloudy') || c.includes('cloud') || c.includes('overcast') || c.includes('gloom')) {
    return isNight ? 'dark clouds night' : 'overcast sky clouds';
  }

  // Clear / Sunny
  if (i.includes('clear') || c.includes('clear') || c.includes('sun')) {
    return isNight ? 'starry night sky stars' : 'clear blue sky sunny';
  }

  // Default fallback
  return isNight ? 'night sky stars' : 'beautiful sky landscape';
};

export const getWeatherVideo = async (condition: string, iconCode: string): Promise<{ videoUrl: string | null }> => {
  const query = getQuery(condition, iconCode);
  const url = `${BASE_URL}?query=${encodeURIComponent(query)}&per_page=8&orientation=landscape&size=medium`;

  const keys = getApiKeys();
  let videoUrl: string | null = null;

  for (const key of keys) {
    try {
      const res = await fetch(url, {
        headers: { Authorization: key }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.videos && data.videos.length > 0) {
          const validVideos = data.videos.filter((v: any) => v.duration >= 5 && v.duration <= 60);
          const pool = validVideos.length > 0 ? validVideos : data.videos;
          const randomVideo = pool[Math.floor(Math.random() * Math.min(pool.length, 5))];

          const videoFiles = randomVideo.video_files;
          const bestFile = videoFiles.find((f: any) => f.height >= 720 && f.height < 1440) || 
                           videoFiles.find((f: any) => f.height >= 540) || 
                           videoFiles[0];
                           
          videoUrl = bestFile.link;
          break; // Found a video, break loop
        }
        break; // If request succeeded but no videos found, don't try other keys
      }
    } catch (error) {
      console.warn("Pexels API fetch failed with key, trying next...");
    }
  }
  
  if (!videoUrl) {
    console.warn("All Pexels API keys failed or blocked. Using fallback video.");
    videoUrl = getFallbackVideo(condition, iconCode);
  }

  return { videoUrl };
};

const getFallbackVideo = (condition: string, iconCode: string): string | null => {
  const c = condition.toLowerCase();
  const isNight = iconCode.includes('night');

  if (c.includes('thunder') || c.includes('storm')) {
    return 'https://videos.pexels.com/video-files/11613204/11613204-hd_1920_1080_24fps.mp4';
  }
  if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) {
    return 'https://videos.pexels.com/video-files/2499611/2499611-hd_1920_1080_30fps.mp4';
  }
  if (c.includes('snow') || c.includes('blizzard')) {
    return 'https://videos.pexels.com/video-files/857032/857032-hd_1920_1080_30fps.mp4';
  }
  if (c.includes('cloud') || c.includes('overcast') || c.includes('fog') || c.includes('mist')) {
    if (isNight) return 'https://videos.pexels.com/video-files/2954041/2954041-hd_1920_1080_30fps.mp4';
    return 'https://videos.pexels.com/video-files/1851190/1851190-hd_1920_1080_25fps.mp4';
  }
  if (c.includes('clear') || c.includes('sun')) {
    if (isNight) return 'https://videos.pexels.com/video-files/2954041/2954041-hd_1920_1080_30fps.mp4';
    return 'https://videos.pexels.com/video-files/1448735/1448735-hd_1920_1080_24fps.mp4';
  }
  
  return 'https://videos.pexels.com/video-files/1851190/1851190-hd_1920_1080_25fps.mp4';
};
