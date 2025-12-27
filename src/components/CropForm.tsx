import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sprout, CloudRain, Thermometer, Droplets, MapPin, Calendar, CloudSun, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { usePrediction } from "@/hooks/usePrediction";
import { useWeather } from "@/hooks/useWeather";

const crops = ["Wheat", "Rice", "Corn", "Soybean", "Potato", "Cotton", "Sugarcane", "Barley"];
const soilTypes = ["Loamy", "Clay", "Sandy", "Silt", "Peat", "Chalky", "Saline"];
const regions = ["North India", "South India", "East India", "West India", "Central India"];
const seasons = ["Kharif (Monsoon)", "Rabi (Winter)", "Zaid (Summer)"];

interface CropFormProps {
  onPredict?: (data: any) => void;
}

interface FormData {
  crop: string;
  soilType: string;
  region: string;
  season: string;
  rainfall: string;
  temperature: string;
  humidity: string;
}

export function CropForm({ onPredict }: CropFormProps) {
  const [formData, setFormData] = useState<FormData>({
    crop: "",
    soilType: "",
    region: "",
    season: "",
    rainfall: "",
    temperature: "",
    humidity: "",
  });
  
  const { predict, isLoading } = usePrediction();
  const { fetchWeather, isLoading: isWeatherLoading } = useWeather();

  const handleUseCurrentWeather = async () => {
    if (!formData.region) {
      toast({
        title: "Select a Region",
        description: "Please select a region first to fetch weather data.",
        variant: "destructive",
      });
      return;
    }

    const weatherData = await fetchWeather(formData.region);
    
    if (weatherData?.current) {
      setFormData((prev) => ({
        ...prev,
        rainfall: String(weatherData.stats?.totalRainfall || weatherData.current.precipitation || 0),
        temperature: String(weatherData.current.temperature || 0),
        humidity: String(weatherData.current.humidity || 0),
      }));
      
      toast({
        title: "Weather Data Loaded",
        description: `Current weather for ${weatherData.region} has been applied.`,
      });
    } else {
      toast({
        title: "Weather Fetch Failed",
        description: "Could not retrieve weather data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.crop || !formData.soilType || !formData.region || !formData.season) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const result = await predict(formData);
    
    if (result && onPredict) {
      onPredict({
        ...formData,
        yield: result.predicted_yield,
        confidence: result.confidence,
        model_accuracy: result.model_accuracy,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Crop Selection */}
        <div className="space-y-2">
          <Label htmlFor="crop" className="flex items-center gap-2">
            <Sprout className="h-4 w-4 text-primary" />
            Crop Type *
          </Label>
          <Select
            value={formData.crop}
            onValueChange={(value) => setFormData({ ...formData, crop: value })}
          >
            <SelectTrigger id="crop">
              <SelectValue placeholder="Select crop" />
            </SelectTrigger>
            <SelectContent>
              {crops.map((crop) => (
                <SelectItem key={crop} value={crop.toLowerCase()}>
                  {crop}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Soil Type */}
        <div className="space-y-2">
          <Label htmlFor="soilType" className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-accent/50" />
            Soil Type *
          </Label>
          <Select
            value={formData.soilType}
            onValueChange={(value) => setFormData({ ...formData, soilType: value })}
          >
            <SelectTrigger id="soilType">
              <SelectValue placeholder="Select soil type" />
            </SelectTrigger>
            <SelectContent>
              {soilTypes.map((soil) => (
                <SelectItem key={soil} value={soil.toLowerCase()}>
                  {soil}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Region */}
        <div className="space-y-2">
          <Label htmlFor="region" className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Region *
          </Label>
          <Select
            value={formData.region}
            onValueChange={(value) => setFormData({ ...formData, region: value })}
          >
            <SelectTrigger id="region">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region} value={region.toLowerCase().replace(/\s+/g, "-")}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Season */}
        <div className="space-y-2">
          <Label htmlFor="season" className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Season *
          </Label>
          <Select
            value={formData.season}
            onValueChange={(value) => setFormData({ ...formData, season: value })}
          >
            <SelectTrigger id="season">
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((season) => (
                <SelectItem key={season} value={season.split(" ")[0].toLowerCase()}>
                  {season}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Weather Auto-fill Section */}
        <div className="md:col-span-2 flex items-center gap-4 p-4 rounded-lg border border-dashed border-primary/30 bg-primary/5">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Auto-fill from Weather</p>
            <p className="text-xs text-muted-foreground">
              Fetch current weather data for the selected region
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUseCurrentWeather}
            disabled={isWeatherLoading || !formData.region}
          >
            {isWeatherLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <CloudSun className="h-4 w-4" />
                Use Current Weather
              </>
            )}
          </Button>
        </div>

        {/* Rainfall */}
        <div className="space-y-2">
          <Label htmlFor="rainfall" className="flex items-center gap-2">
            <CloudRain className="h-4 w-4 text-primary" />
            Rainfall (mm)
          </Label>
          <Input
            id="rainfall"
            type="number"
            placeholder="e.g., 150"
            value={formData.rainfall}
            onChange={(e) => setFormData({ ...formData, rainfall: e.target.value })}
          />
        </div>

        {/* Temperature */}
        <div className="space-y-2">
          <Label htmlFor="temperature" className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-accent" />
            Temperature (°C)
          </Label>
          <Input
            id="temperature"
            type="number"
            placeholder="e.g., 28"
            value={formData.temperature}
            onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
          />
        </div>

        {/* Humidity */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="humidity" className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-primary" />
            Humidity (%)
          </Label>
          <Input
            id="humidity"
            type="number"
            placeholder="e.g., 65"
            value={formData.humidity}
            onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
            className="md:w-1/2"
          />
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            Calculating Prediction...
          </>
        ) : (
          <>
            <Sprout className="h-4 w-4" />
            Predict Crop Yield
          </>
        )}
      </Button>
    </form>
  );
}
