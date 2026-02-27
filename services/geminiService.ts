import { GoogleGenAI } from "@google/genai";
import { WeatherData } from '../types';

let ai: GoogleGenAI | null = null;

const getAIClient = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const getGeminiWeatherInsight = async (weather: WeatherData, userQuery?: string): Promise<string> => {
  try {
    const client = getAIClient();
    
    // Create a simplified summary to save tokens and reduce noise
    const summary = {
      location: `${weather.location.city}, ${weather.location.country}`,
      sources: weather.sources,
      current: {
        temp: weather.current.temp,
        condition: weather.current.condition,
        feelsLike: weather.current.feelsLike,
        wind: weather.current.windSpeed,
        humidity: weather.current.humidity,
        aqi: weather.current.aqi,
      },
      forecastToday: weather.forecast[0],
      forecastTomorrow: weather.forecast[1],
    };

    const prompt = userQuery 
      ? `Data: ${JSON.stringify(summary)}. User question: ${userQuery}. Answer briefly and helpfully based on this multi-source weather data.`
      : `Data: ${JSON.stringify(summary)}. 
         You are SkyCast AI. We are using data from ${weather.sources.join(', ')}.
         Provide a short, witty, and helpful weather summary. 
         If AQI is bad, warn the user. 
         Mention if models agree on the condition. 
         Keep it under 60 words.`;

    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a friendly weather forecaster called SkyCast AI.",
      }
    });

    return response.text || "I couldn't generate a forecast at this moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI Weather insights are temporarily unavailable.";
  }
};
