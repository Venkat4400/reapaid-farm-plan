import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface PredictionInput {
  crop: string;
  soilType: string;
  region: string;
  state?: string;
  district?: string;
  season: string;
  rainfall: string;
  temperature: string;
  humidity: string;
}

interface PredictionResult {
  id: string;
  predicted_yield: number;
  confidence: number;
  model_accuracy: {
    r2_score: number;
    mae: number;
    rmse: number;
  };
  crop: string;
  created_at: string;
  local_data_used?: boolean;
  similar_records_count?: number;
}

export function usePrediction() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const predict = async (input: PredictionInput): Promise<PredictionResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Please log in to make predictions");
      }

      // Get state name from state code
      const { indianStates } = await import("@/data/indianLocations");
      const stateData = indianStates.find(s => s.code === input.state);
      const stateName = stateData?.name || input.state;

      const response = await supabase.functions.invoke("predict-yield", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          crop: input.crop,
          soil_type: input.soilType,
          region: input.region,
          state: stateName,
          district: input.district,
          season: input.season,
          rainfall: parseFloat(input.rainfall) || 150,
          temperature: parseFloat(input.temperature) || 28,
          humidity: parseFloat(input.humidity) || 65,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Prediction failed");
      }

      if (!response.data?.success) {
        throw new Error(response.data?.error || "Prediction failed");
      }

      const prediction = response.data.prediction as PredictionResult;
      setResult(prediction);

      const localDataInfo = prediction.local_data_used 
        ? ` (Based on ${prediction.similar_records_count} local records)` 
        : "";
      
      toast({
        title: "Prediction Complete!",
        description: `Estimated yield: ${prediction.predicted_yield.toLocaleString()} kg/ha${localDataInfo}`,
      });

      return prediction;
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      toast({
        title: "Prediction Failed",
        description: message,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  return {
    predict,
    isLoading,
    result,
    error,
    clearResult,
  };
}
