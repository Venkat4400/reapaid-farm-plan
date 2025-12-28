import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HelpCircle,
  MapPin,
  Mountain,
  Calendar,
  Thermometer,
  Droplets,
  Cloud,
  Sprout,
  Loader2,
} from "lucide-react";
import { indianStates, soilTypeInfo, seasonInfo } from "@/data/cropData";

interface SmartInputFormProps {
  onSubmit: (data: SmartInputData) => void;
  isLoading?: boolean;
  isBeginnerMode?: boolean;
}

export interface SmartInputData {
  region: string;
  state?: string;
  soilType: string;
  season: string;
  landType: "dry" | "wet";
  temperature: number;
  rainfall: number;
  humidity: number;
}

const regions = Object.keys(indianStates);
const soilTypes = Object.keys(soilTypeInfo);
const seasons = Object.keys(seasonInfo);

export function SmartInputForm({
  onSubmit,
  isLoading = false,
  isBeginnerMode = true,
}: SmartInputFormProps) {
  const [formData, setFormData] = useState<SmartInputData>({
    region: "North India",
    soilType: "Loamy",
    season: "Rabi",
    landType: "wet",
    temperature: 25,
    rainfall: 800,
    humidity: 65,
  });

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const selectedSoil = soilTypeInfo[formData.soilType as keyof typeof soilTypeInfo];
  const selectedSeason = seasonInfo[formData.season as keyof typeof seasonInfo];

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sprout className="h-5 w-5 text-primary" />
          Tell Us About Your Farm
        </CardTitle>
        {isBeginnerMode && (
          <p className="text-sm text-muted-foreground">
            Fill in these details to get personalized crop recommendations. Hover over{" "}
            <HelpCircle className="inline h-3 w-3" /> for help!
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Region Selection */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="region" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Region
              </Label>
              {isBeginnerMode && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Select the part of India where your farm is located.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <Select
              value={formData.region}
              onValueChange={(v) => setFormData((d) => ({ ...d, region: v }))}
            >
              <SelectTrigger id="region">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Soil Type */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="soil" className="flex items-center gap-2">
                <Mountain className="h-4 w-4 text-amber-600" />
                Soil Type
              </Label>
              {isBeginnerMode && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>What type of soil does your farm have?</p>
                      <p className="mt-1 text-xs">
                        Not sure? Loamy soil is brown and crumbly. Black soil is dark and sticky.
                        Sandy soil feels gritty.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <Select
              value={formData.soilType}
              onValueChange={(v) => setFormData((d) => ({ ...d, soilType: v }))}
            >
              <SelectTrigger id="soil">
                <SelectValue placeholder="Select soil type" />
              </SelectTrigger>
              <SelectContent>
                {soilTypes.map((soil) => {
                  const info = soilTypeInfo[soil as keyof typeof soilTypeInfo];
                  return (
                    <SelectItem key={soil} value={soil}>
                      <span className="flex items-center gap-2">
                        <span>{info.icon}</span>
                        {info.name}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {isBeginnerMode && selectedSoil && (
              <p className="text-xs text-muted-foreground">{selectedSoil.description}</p>
            )}
          </div>
        </div>

        {/* Season Selection */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              Season
            </Label>
            {isBeginnerMode && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>When do you want to sow?</p>
                    <ul className="mt-1 text-xs space-y-1">
                      <li>🌧️ Kharif: June-Oct (Monsoon)</li>
                      <li>❄️ Rabi: Oct-Mar (Winter)</li>
                      <li>☀️ Zaid: Mar-Jun (Summer)</li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {seasons.map((season) => {
              const info = seasonInfo[season as keyof typeof seasonInfo];
              return (
                <button
                  key={season}
                  type="button"
                  onClick={() => setFormData((d) => ({ ...d, season }))}
                  className={`rounded-xl border-2 p-4 text-center transition-all ${
                    formData.season === season
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-2xl">{info.icon}</span>
                  <p className="mt-1 font-medium text-foreground">{season}</p>
                  <p className="text-xs text-muted-foreground">{info.months}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Land Type */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              Land Type
            </Label>
            {isBeginnerMode && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Do you have irrigation (canal, tube well, pond)?</p>
                    <p className="mt-1 text-xs">
                      Wet land = Can water regularly. Dry land = Depends on rain.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <RadioGroup
            value={formData.landType}
            onValueChange={(v) => setFormData((d) => ({ ...d, landType: v as "dry" | "wet" }))}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="wet" id="wet" />
              <Label htmlFor="wet" className="flex items-center gap-1 cursor-pointer">
                💧 Wet Land (Irrigated)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dry" id="dry" />
              <Label htmlFor="dry" className="flex items-center gap-1 cursor-pointer">
                🏜️ Dry Land (Rain-fed)
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Weather Conditions */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-orange-500" />
                Temperature
              </Label>
              <span className="text-sm font-medium text-primary">{formData.temperature}°C</span>
            </div>
            <Slider
              value={[formData.temperature]}
              onValueChange={([v]) => setFormData((d) => ({ ...d, temperature: v }))}
              min={5}
              max={45}
              step={1}
              className="w-full"
            />
            {isBeginnerMode && (
              <p className="text-xs text-muted-foreground">
                Average temperature in your area
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-blue-500" />
                Rainfall
              </Label>
              <span className="text-sm font-medium text-primary">{formData.rainfall}mm</span>
            </div>
            <Slider
              value={[formData.rainfall]}
              onValueChange={([v]) => setFormData((d) => ({ ...d, rainfall: v }))}
              min={100}
              max={2000}
              step={50}
              className="w-full"
            />
            {isBeginnerMode && (
              <p className="text-xs text-muted-foreground">
                {formData.rainfall < 500 ? "Low" : formData.rainfall < 1000 ? "Medium" : "High"}{" "}
                rainfall area
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-cyan-500" />
                Humidity
              </Label>
              <span className="text-sm font-medium text-primary">{formData.humidity}%</span>
            </div>
            <Slider
              value={[formData.humidity]}
              onValueChange={([v]) => setFormData((d) => ({ ...d, humidity: v }))}
              min={20}
              max={95}
              step={5}
              className="w-full"
            />
            {isBeginnerMode && (
              <p className="text-xs text-muted-foreground">
                {formData.humidity < 40 ? "Dry air" : formData.humidity < 70 ? "Moderate" : "Humid"}
              </p>
            )}
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          size="lg"
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Finding Best Crops...
            </>
          ) : (
            <>
              <Sprout className="h-4 w-4" />
              Get Crop Recommendations
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
