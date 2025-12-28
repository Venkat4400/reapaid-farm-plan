import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Droplet,
  Thermometer,
  Sun,
  Calendar,
  MapPin,
  ChevronRight,
  HelpCircle,
  Sprout,
} from "lucide-react";
import { Link } from "react-router-dom";
import { CropInfo } from "@/data/cropData";
import { cn } from "@/lib/utils";

interface CropRecommendationCardProps {
  crop: CropInfo & { score?: number; matchReasons?: string[] };
  rank: number;
  isBeginnerMode?: boolean;
}

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-900";
    case 2:
      return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800";
    case 3:
      return "bg-gradient-to-r from-amber-600 to-orange-700 text-amber-100";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getWaterIcon = (level: "low" | "medium" | "high") => {
  const drops = level === "low" ? 1 : level === "medium" ? 2 : 3;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: drops }).map((_, i) => (
        <Droplet key={i} className="h-3 w-3 fill-blue-500 text-blue-500" />
      ))}
      {Array.from({ length: 3 - drops }).map((_, i) => (
        <Droplet key={i} className="h-3 w-3 text-muted-foreground/30" />
      ))}
    </div>
  );
};

export function CropRecommendationCard({
  crop,
  rank,
  isBeginnerMode = true,
}: CropRecommendationCardProps) {
  const confidence = crop.score ? Math.min(95, Math.round(crop.score * 1.2)) : 80;

  return (
    <Card className="group overflow-hidden border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg animate-slide-up">
      <CardHeader className="relative pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{crop.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">{crop.name}</h3>
                <Badge className={cn("text-xs font-bold", getRankColor(rank))}>
                  #{rank}
                </Badge>
              </div>
              <Badge variant="secondary" className="mt-1 text-xs">
                {crop.category.replace("-", " ").replace(/^\w/, (c) => c.toUpperCase())}
              </Badge>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{confidence}%</div>
                  <p className="text-xs text-muted-foreground">match</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>How well this crop matches your conditions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground">{crop.description}</p>

        {/* Key indicators */}
        <div className="grid grid-cols-2 gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2">
                  <Thermometer className="h-4 w-4 text-orange-500" />
                  <span className="text-xs">
                    {crop.minTemp}°C - {crop.maxTemp}°C
                  </span>
                  {isBeginnerMode && (
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">Temperature Range</p>
                <p className="text-xs">
                  This crop grows best between {crop.minTemp}°C and {crop.maxTemp}°C
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2">
                  {getWaterIcon(crop.waterRequirement)}
                  <span className="text-xs capitalize">{crop.waterRequirement}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">Water Requirement</p>
                <p className="text-xs">
                  {crop.waterRequirement === "low" &&
                    "Needs less water. Good for dry areas or less irrigation."}
                  {crop.waterRequirement === "medium" &&
                    "Needs regular watering. Normal irrigation is enough."}
                  {crop.waterRequirement === "high" &&
                    "Needs lots of water. Must have good irrigation or rainfall."}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-xs">{crop.growingDays} days</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">Growing Period</p>
                <p className="text-xs">
                  Takes about {crop.growingDays} days from sowing to harvest
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2">
                  <Sprout className="h-4 w-4 text-green-600" />
                  <span className="text-xs truncate">{crop.yieldRange}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">Expected Yield</p>
                <p className="text-xs">
                  You can expect {crop.yieldRange} from your field
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Match reasons */}
        {crop.matchReasons && crop.matchReasons.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-foreground">Why this crop?</p>
            <ul className="space-y-1">
              {crop.matchReasons.slice(0, 3).map((reason, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Seasons and soil */}
        <div className="flex flex-wrap gap-1">
          {crop.seasons.map((season) => (
            <Badge key={season} variant="outline" className="text-xs">
              {season}
            </Badge>
          ))}
          {crop.soilTypes.slice(0, 2).map((soil) => (
            <Badge key={soil} variant="outline" className="text-xs">
              {soil}
            </Badge>
          ))}
        </div>

        <Link to="/predict">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground"
          >
            Calculate Exact Yield
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
