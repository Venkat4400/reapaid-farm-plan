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
import { Sprout, CloudRain, Thermometer, Droplets, MapPin, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const crops = ["Wheat", "Rice", "Corn", "Soybean", "Potato", "Cotton", "Sugarcane", "Barley"];
const soilTypes = ["Loamy", "Clay", "Sandy", "Silt", "Peat", "Chalky", "Saline"];
const regions = ["North India", "South India", "East India", "West India", "Central India"];
const seasons = ["Kharif (Monsoon)", "Rabi (Winter)", "Zaid (Summer)"];

interface CropFormProps {
  onPredict?: (data: FormData) => void;
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
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);
    
    // Simulate prediction
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    if (onPredict) {
      onPredict(formData);
    }
    
    toast({
      title: "Prediction Complete!",
      description: "Your crop yield prediction has been calculated.",
    });
    
    setIsLoading(false);
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
