import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import {
  ArrowLeft,
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  Sun,
  CloudRain,
  Cloud,
  RefreshCw,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

const weeklyForecast = [
  { day: "Mon", icon: Sun, temp: 32, condition: "Sunny", humidity: 45 },
  { day: "Tue", icon: CloudSun, temp: 29, condition: "Partly Cloudy", humidity: 55 },
  { day: "Wed", icon: Cloud, temp: 27, condition: "Cloudy", humidity: 65 },
  { day: "Thu", icon: CloudRain, temp: 24, condition: "Rainy", humidity: 80 },
  { day: "Fri", icon: CloudRain, temp: 23, condition: "Rainy", humidity: 85 },
  { day: "Sat", icon: CloudSun, temp: 26, condition: "Partly Cloudy", humidity: 60 },
  { day: "Sun", icon: Sun, temp: 30, condition: "Sunny", humidity: 50 },
];

const recommendations = [
  {
    title: "Optimal Planting Window",
    description: "Next 3 days are ideal for planting wheat and barley due to moderate temperatures and upcoming rainfall.",
    type: "positive",
  },
  {
    title: "Irrigation Advisory",
    description: "Rain expected on Thursday and Friday. Consider reducing irrigation schedules.",
    type: "info",
  },
  {
    title: "Pest Alert",
    description: "High humidity on Thu-Fri may increase pest activity. Monitor crops closely.",
    type: "warning",
  },
];

export default function Weather() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Weather Insights</h1>
                <p className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  North India Region
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Current Weather */}
        <div className="mb-8 rounded-2xl border border-border bg-gradient-to-br from-secondary/50 to-accent/20 p-8">
          <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
            <div className="flex items-center gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-accent/20">
                <Sun className="h-14 w-14 text-accent animate-pulse-soft" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-bold text-foreground">28</span>
                  <span className="text-2xl text-muted-foreground">°C</span>
                </div>
                <p className="text-lg text-muted-foreground">Partly Cloudy</p>
                <p className="text-sm text-muted-foreground">Feels like 30°C</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Droplets className="h-6 w-6 text-primary" />
                </div>
                <p className="text-xl font-bold text-foreground">65%</p>
                <p className="text-xs text-muted-foreground">Humidity</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <Wind className="h-6 w-6 text-accent" />
                </div>
                <p className="text-xl font-bold text-foreground">12 km/h</p>
                <p className="text-xs text-muted-foreground">Wind Speed</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                  <CloudRain className="h-6 w-6 text-secondary-foreground" />
                </div>
                <p className="text-xl font-bold text-foreground">15mm</p>
                <p className="text-xs text-muted-foreground">Rainfall</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Thermometer className="h-6 w-6 text-primary" />
                </div>
                <p className="text-xl font-bold text-foreground">1015 hPa</p>
                <p className="text-xs text-muted-foreground">Pressure</p>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Forecast */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-foreground">7-Day Forecast</h2>
          <div className="grid gap-4 sm:grid-cols-7">
            {weeklyForecast.map((day, index) => (
              <div
                key={day.day}
                className="rounded-xl border border-border bg-card p-4 text-center transition-all hover:border-primary/50 hover:shadow-md animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <p className="text-sm font-medium text-muted-foreground">{day.day}</p>
                <day.icon className="mx-auto my-3 h-8 w-8 text-accent" />
                <p className="text-lg font-bold text-foreground">{day.temp}°</p>
                <p className="mt-1 text-xs text-muted-foreground">{day.condition}</p>
                <div className="mt-2 flex items-center justify-center gap-1 text-xs text-primary">
                  <Droplets className="h-3 w-3" />
                  {day.humidity}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Avg. Temperature"
            value="27°C"
            subtitle="This week"
            icon={Thermometer}
            variant="accent"
          />
          <StatCard
            title="Total Rainfall"
            value="45mm"
            subtitle="Expected this week"
            icon={CloudRain}
            variant="primary"
          />
          <StatCard
            title="Humidity Range"
            value="45-85%"
            subtitle="Weekly variation"
            icon={Droplets}
            variant="secondary"
          />
          <StatCard
            title="Farming Conditions"
            value="Good"
            subtitle="Overall assessment"
            icon={CloudSun}
            variant="default"
          />
        </div>

        {/* Recommendations */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-foreground">Farming Recommendations</h2>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`rounded-xl border p-4 animate-slide-up ${
                  rec.type === "positive"
                    ? "border-primary/30 bg-primary/5"
                    : rec.type === "warning"
                    ? "border-accent/30 bg-accent/5"
                    : "border-border bg-card"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="font-semibold text-foreground">{rec.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
