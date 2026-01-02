import { useState, useEffect } from "react";
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
import { Sprout, CloudRain, Thermometer, Droplets, MapPin, Calendar, CloudSun, Loader2, Building, Home } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { usePrediction } from "@/hooks/usePrediction";
import { useWeather } from "@/hooks/useWeather";
import { indianStates, getDistrictsForState, getVillagesForDistrict } from "@/data/indianLocations";

const crops = ["Wheat", "Rice", "Corn", "Soybean", "Potato", "Cotton", "Sugarcane", "Barley", "Jowar", "Bajra", "Maize", "Chickpea", "Groundnut", "Mustard", "Sunflower"];
const soilTypes = ["Loamy", "Clay", "Sandy", "Silt", "Peat", "Chalky", "Saline", "Black", "Red", "Alluvial", "Laterite"];
const seasons = ["Kharif (Monsoon)", "Rabi (Winter)", "Zaid (Summer)"];

interface CropFormProps {
  onPredict?: (data: any) => void;
}

interface FormData {
  crop: string;
  soilType: string;
  state: string;
  district: string;
  village: string;
  season: string;
  rainfall: string;
  temperature: string;
  humidity: string;
}

export function CropForm({ onPredict }: CropFormProps) {
  const [formData, setFormData] = useState<FormData>({
    crop: "",
    soilType: "",
    state: "",
    district: "",
    village: "",
    season: "",
    rainfall: "",
    temperature: "",
    humidity: "",
  });
  
  const [districts, setDistricts] = useState<string[]>([]);
  const [villages, setVillages] = useState<string[]>([]);
  
  const { predict, isLoading } = usePrediction();
  const { fetchWeather, isLoading: isWeatherLoading } = useWeather();

  // Update districts when state changes
  useEffect(() => {
    if (formData.state) {
      const stateDistricts = getDistrictsForState(formData.state);
      setDistricts(stateDistricts);
      setFormData(prev => ({ ...prev, district: "", village: "" }));
      setVillages([]);
    }
  }, [formData.state]);

  // Update villages when district changes
  useEffect(() => {
    if (formData.district) {
      const districtVillages = getVillagesForDistrict(formData.district);
      setVillages(districtVillages);
      setFormData(prev => ({ ...prev, village: "" }));
    }
  }, [formData.district]);

  const handleUseCurrentWeather = async () => {
    if (!formData.state) {
      toast({
        title: "Select a State",
        description: "Please select a state first to fetch weather data.",
        variant: "destructive",
      });
      return;
    }

    const weatherData = await fetchWeather(formData.state);
    
    if (weatherData?.current) {
      setFormData((prev) => ({
        ...prev,
        rainfall: String(weatherData.stats?.totalRainfall || weatherData.current.precipitation || 0),
        temperature: String(weatherData.current.temperature || 0),
        humidity: String(weatherData.current.humidity || 0),
      }));
      
      toast({
        title: "Weather Data Loaded",
        description: `Current weather for ${weatherData.region} has been applied. ${weatherData.forecastDays}-day forecast available.`,
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
    
    if (!formData.crop || !formData.soilType || !formData.state || !formData.season) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Crop, Soil, State, Season).",
        variant: "destructive",
      });
      return;
    }

    // Map state code to region for backward compatibility with prediction API
    const stateData = indianStates.find(s => s.code === formData.state);
    const regionMapping: Record<string, string> = {
      "UP": "north-india", "HR": "north-india", "PB": "north-india", "RJ": "north-india", "DL": "north-india", "UK": "north-india", "HP": "north-india", "JK": "north-india", "LA": "north-india",
      "TN": "south-india", "KL": "south-india", "KA": "south-india", "AP": "south-india", "TS": "south-india",
      "WB": "east-india", "OD": "east-india", "BR": "east-india", "JH": "east-india", "AS": "east-india", "AR": "east-india", "MN": "east-india", "ML": "east-india", "MZ": "east-india", "NL": "east-india", "TR": "east-india", "SK": "east-india",
      "MH": "west-india", "GJ": "west-india", "GA": "west-india",
      "MP": "central-india", "CG": "central-india",
    };
    
    const region = regionMapping[formData.state] || "central-india";

    const result = await predict({
      ...formData,
      region,
    });
    
    if (result && onPredict) {
      onPredict({
        ...formData,
        region,
        stateName: stateData?.name || formData.state,
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

        {/* State Selection */}
        <div className="space-y-2">
          <Label htmlFor="state" className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            State *
          </Label>
          <Select
            value={formData.state}
            onValueChange={(value) => setFormData({ ...formData, state: value })}
          >
            <SelectTrigger id="state">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {indianStates.map((state) => (
                <SelectItem key={state.code} value={state.code}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* District Selection */}
        <div className="space-y-2">
          <Label htmlFor="district" className="flex items-center gap-2">
            <Building className="h-4 w-4 text-primary" />
            District
          </Label>
          <Select
            value={formData.district}
            onValueChange={(value) => setFormData({ ...formData, district: value })}
            disabled={!formData.state || districts.length === 0}
          >
            <SelectTrigger id="district">
              <SelectValue placeholder={formData.state ? "Select district" : "Select state first"} />
            </SelectTrigger>
            <SelectContent>
              {districts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Village/Town Selection or Input */}
        <div className="space-y-2">
          <Label htmlFor="village" className="flex items-center gap-2">
            <Home className="h-4 w-4 text-primary" />
            Village / Town
          </Label>
          {villages.length > 0 ? (
            <Select
              value={formData.village}
              onValueChange={(value) => setFormData({ ...formData, village: value })}
              disabled={!formData.district}
            >
              <SelectTrigger id="village">
                <SelectValue placeholder="Select village/town" />
              </SelectTrigger>
              <SelectContent>
                {villages.map((village) => (
                  <SelectItem key={village} value={village}>
                    {village}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="village"
              placeholder="Enter village/town name"
              value={formData.village}
              onChange={(e) => setFormData({ ...formData, village: e.target.value })}
            />
          )}
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
            <p className="text-sm font-medium text-foreground">Auto-fill from Real Weather API</p>
            <p className="text-xs text-muted-foreground">
              Fetch accurate 30-day weather forecast for the selected state
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUseCurrentWeather}
            disabled={isWeatherLoading || !formData.state}
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
