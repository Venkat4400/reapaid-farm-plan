import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Open-Meteo API (free, no API key required)
const WEATHER_API_BASE = "https://api.open-meteo.com/v1/forecast";

// Region coordinates mapping
const regionCoordinates: Record<string, { lat: number; lon: number; name: string }> = {
  "north-india": { lat: 28.6139, lon: 77.209, name: "North India (Delhi)" },
  "south-india": { lat: 13.0827, lon: 80.2707, name: "South India (Chennai)" },
  "east-india": { lat: 22.5726, lon: 88.3639, name: "East India (Kolkata)" },
  "west-india": { lat: 19.076, lon: 72.8777, name: "West India (Mumbai)" },
  "central-india": { lat: 23.2599, lon: 77.4126, name: "Central India (Bhopal)" },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { region = "north-india" } = await req.json();
    
    const coords = regionCoordinates[region] || regionCoordinates["north-india"];
    
    console.log(`Fetching weather for ${coords.name} (${coords.lat}, ${coords.lon})`);
    
    // Fetch weather data from Open-Meteo
    const url = `${WEATHER_API_BASE}?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean&timezone=auto&forecast_days=7`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Map weather codes to conditions
    const getWeatherCondition = (code: number): string => {
      if (code === 0) return "Clear";
      if (code <= 3) return "Partly Cloudy";
      if (code <= 48) return "Foggy";
      if (code <= 57) return "Drizzle";
      if (code <= 67) return "Rain";
      if (code <= 77) return "Snow";
      if (code <= 82) return "Showers";
      if (code <= 99) return "Thunderstorm";
      return "Unknown";
    };
    
    const getWeatherIcon = (code: number): string => {
      if (code === 0) return "sun";
      if (code <= 3) return "cloud-sun";
      if (code <= 48) return "cloud";
      if (code <= 67) return "cloud-rain";
      if (code <= 77) return "cloud-snow";
      if (code <= 99) return "cloud-lightning";
      return "cloud";
    };
    
    // Current weather
    const current = {
      temperature: Math.round(data.current.temperature_2m),
      feelsLike: Math.round(data.current.apparent_temperature),
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
      windSpeed: Math.round(data.current.wind_speed_10m),
      pressure: Math.round(data.current.surface_pressure),
      condition: getWeatherCondition(data.current.weather_code),
      icon: getWeatherIcon(data.current.weather_code),
    };
    
    // 7-day forecast
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const forecast = data.daily.time.map((date: string, index: number) => {
      const d = new Date(date);
      return {
        day: days[d.getDay()],
        date: date,
        tempMax: Math.round(data.daily.temperature_2m_max[index]),
        tempMin: Math.round(data.daily.temperature_2m_min[index]),
        precipitation: data.daily.precipitation_sum[index],
        humidity: data.daily.relative_humidity_2m_mean[index],
        condition: getWeatherCondition(data.daily.weather_code[index]),
        icon: getWeatherIcon(data.daily.weather_code[index]),
      };
    });
    
    // Calculate weekly stats
    const avgTemp = Math.round(forecast.reduce((sum: number, day: any) => sum + (day.tempMax + day.tempMin) / 2, 0) / forecast.length);
    const totalRainfall = Math.round(forecast.reduce((sum: number, day: any) => sum + day.precipitation, 0));
    const humidityRange = {
      min: Math.min(...forecast.map((d: any) => d.humidity)),
      max: Math.max(...forecast.map((d: any) => d.humidity)),
    };
    
    // Generate farming recommendations based on weather
    const recommendations = [];
    
    const rainyDays = forecast.filter((d: any) => d.precipitation > 5).length;
    const avgHumidity = forecast.reduce((sum: number, d: any) => sum + d.humidity, 0) / forecast.length;
    
    if (rainyDays >= 2) {
      recommendations.push({
        title: "Irrigation Advisory",
        description: `Rain expected on ${rainyDays} days this week. Consider reducing irrigation schedules to prevent waterlogging.`,
        type: "info",
      });
    }
    
    if (avgTemp >= 25 && avgTemp <= 30 && totalRainfall > 10) {
      recommendations.push({
        title: "Optimal Planting Window",
        description: "Current weather conditions are favorable for planting wheat, barley, and rice crops.",
        type: "positive",
      });
    }
    
    if (avgHumidity > 75) {
      recommendations.push({
        title: "Pest Alert",
        description: "High humidity levels may increase pest and fungal activity. Monitor crops closely and consider preventive measures.",
        type: "warning",
      });
    }
    
    if (current.temperature > 35) {
      recommendations.push({
        title: "Heat Stress Warning",
        description: "High temperatures may stress crops. Ensure adequate irrigation and consider mulching to retain soil moisture.",
        type: "warning",
      });
    }
    
    if (recommendations.length === 0) {
      recommendations.push({
        title: "Stable Conditions",
        description: "Weather conditions are stable this week. Good time for regular farming activities.",
        type: "positive",
      });
    }
    
    // Determine farming conditions rating
    let farmingConditions = "Good";
    if (avgTemp > 38 || avgTemp < 10 || totalRainfall > 200) {
      farmingConditions = "Poor";
    } else if (rainyDays > 4 || avgHumidity > 85) {
      farmingConditions = "Fair";
    } else if (avgTemp >= 20 && avgTemp <= 32 && totalRainfall >= 10 && totalRainfall <= 100) {
      farmingConditions = "Excellent";
    }
    
    return new Response(JSON.stringify({
      success: true,
      region: coords.name,
      current,
      forecast,
      stats: {
        avgTemp,
        totalRainfall,
        humidityRange: `${humidityRange.min}-${humidityRange.max}%`,
        farmingConditions,
      },
      recommendations,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch weather data' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
