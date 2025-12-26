import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  pressure: number;
  condition: string;
  icon: string;
}

interface ForecastDay {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  humidity: number;
  condition: string;
  icon: string;
}

interface WeatherStats {
  avgTemp: number;
  totalRainfall: number;
  humidityRange: string;
  farmingConditions: string;
}

interface Recommendation {
  title: string;
  description: string;
  type: "positive" | "info" | "warning";
}

interface WeatherData {
  region: string;
  current: CurrentWeather;
  forecast: ForecastDay[];
  stats: WeatherStats;
  recommendations: Recommendation[];
}

export function useWeather() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (region: string = "north-india") => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: response, error: invokeError } = await supabase.functions.invoke("get-weather", {
        body: { region },
      });

      if (invokeError) {
        throw new Error(invokeError.message);
      }

      if (!response?.success) {
        throw new Error(response?.error || "Failed to fetch weather");
      }

      setData(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch weather";
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    data,
    isLoading,
    error,
    fetchWeather,
  };
}
