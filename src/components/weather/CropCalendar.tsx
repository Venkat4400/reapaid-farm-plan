import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Sprout, Sun, CloudRain, Snowflake, Wheat } from "lucide-react";
import { crops, cropCategories } from "@/data/cropData";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const seasonMonths = {
  Kharif: { start: 5, end: 9, color: "bg-green-500", label: "Monsoon Season", icon: CloudRain },
  Rabi: { start: 9, end: 2, color: "bg-amber-500", label: "Winter Season", icon: Snowflake },
  Zaid: { start: 2, end: 5, color: "bg-orange-500", label: "Summer Season", icon: Sun },
};

interface CropCalendarProps {
  selectedRegion?: string;
}

export function CropCalendar({ selectedRegion = "North India" }: CropCalendarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  const filteredCrops = crops.filter((crop) => {
    const matchesCategory = selectedCategory === "all" || crop.category === selectedCategory;
    const matchesRegion = crop.regions.some(r => 
      r.toLowerCase().includes(selectedRegion.toLowerCase().replace("-", " "))
    );
    return matchesCategory && matchesRegion;
  });

  const getMonthsForSeason = (season: string) => {
    const info = seasonMonths[season as keyof typeof seasonMonths];
    if (!info) return [];
    
    const monthList: number[] = [];
    if (info.start <= info.end) {
      for (let i = info.start; i <= info.end; i++) {
        monthList.push(i);
      }
    } else {
      for (let i = info.start; i < 12; i++) {
        monthList.push(i);
      }
      for (let i = 0; i <= info.end; i++) {
        monthList.push(i);
      }
    }
    return monthList;
  };

  const getCropSeasonColor = (crop: typeof crops[0]) => {
    if (crop.seasons.includes("Kharif")) return "bg-green-100 border-green-300 text-green-800";
    if (crop.seasons.includes("Rabi")) return "bg-amber-100 border-amber-300 text-amber-800";
    if (crop.seasons.includes("Zaid")) return "bg-orange-100 border-orange-300 text-orange-800";
    return "bg-gray-100 border-gray-300 text-gray-800";
  };

  const getCropsForMonth = (monthIndex: number) => {
    return filteredCrops.filter((crop) => {
      return crop.seasons.some((season) => {
        const monthsInSeason = getMonthsForSeason(season);
        return monthsInSeason.includes(monthIndex);
      });
    });
  };

  const currentMonth = new Date().getMonth();

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-5 w-5 text-primary" />
            Crop Calendar
          </CardTitle>
          <div className="flex items-center gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Crops" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crops</SelectItem>
                {cropCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "calendar" | "list")}>
              <TabsList className="grid w-[140px] grid-cols-2">
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Season Legend */}
        <div className="mt-4 flex flex-wrap gap-3">
          {Object.entries(seasonMonths).map(([season, info]) => {
            const Icon = info.icon;
            return (
              <div key={season} className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${info.color}`} />
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {season} ({info.label})
                </span>
              </div>
            );
          })}
        </div>
      </CardHeader>

      <CardContent>
        {viewMode === "calendar" ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {months.map((month, index) => {
              const cropsInMonth = getCropsForMonth(index);
              const isCurrentMonth = index === currentMonth;
              
              // Determine season for this month
              let seasonColor = "border-border";
              if (index >= 5 && index <= 9) seasonColor = "border-green-400 bg-green-50/50";
              else if (index >= 10 || index <= 2) seasonColor = "border-amber-400 bg-amber-50/50";
              else seasonColor = "border-orange-400 bg-orange-50/50";

              return (
                <div
                  key={month}
                  className={`rounded-xl border-2 p-3 transition-all ${seasonColor} ${
                    isCurrentMonth ? "ring-2 ring-primary ring-offset-2" : ""
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className={`text-sm font-semibold ${isCurrentMonth ? "text-primary" : "text-foreground"}`}>
                      {month.slice(0, 3)}
                    </h4>
                    {isCurrentMonth && (
                      <Badge variant="default" className="text-xs px-1.5 py-0">
                        Now
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {cropsInMonth.slice(0, 4).map((crop) => (
                      <span
                        key={crop.name}
                        className="text-lg"
                        title={crop.name}
                      >
                        {crop.icon}
                      </span>
                    ))}
                    {cropsInMonth.length > 4 && (
                      <span className="text-xs text-muted-foreground">
                        +{cropsInMonth.length - 4}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {cropsInMonth.length} crops
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(seasonMonths).map(([season, info]) => {
              const seasonCrops = filteredCrops.filter((crop) =>
                crop.seasons.includes(season)
              );
              const Icon = info.icon;

              return (
                <div key={season} className="rounded-xl border p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full ${info.color}`} />
                    <Icon className="h-5 w-5" />
                    <h3 className="font-semibold text-foreground">{season} Season</h3>
                    <span className="text-sm text-muted-foreground">({info.label})</span>
                    <Badge variant="secondary" className="ml-auto">
                      {seasonCrops.length} crops
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {seasonCrops.map((crop) => (
                      <Badge
                        key={crop.name}
                        variant="outline"
                        className={getCropSeasonColor(crop)}
                      >
                        <span className="mr-1">{crop.icon}</span>
                        {crop.name}
                      </Badge>
                    ))}
                  </div>
                  {seasonCrops.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No crops match your filters for this season.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Tips */}
        <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wheat className="h-5 w-5 text-primary" />
            <h4 className="font-semibold text-foreground">Sowing Tips for {selectedRegion.replace("-", " ")}</h4>
          </div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>🌧️ <strong>Kharif (June-October):</strong> Sow at the onset of monsoon. Good for rice, cotton, maize.</li>
            <li>❄️ <strong>Rabi (October-March):</strong> Sow after monsoon. Best for wheat, chickpea, mustard.</li>
            <li>☀️ <strong>Zaid (March-June):</strong> Short-duration crops. Ideal for moong, watermelon, cucumber.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
