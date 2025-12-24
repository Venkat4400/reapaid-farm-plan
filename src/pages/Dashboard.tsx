import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { YieldChart } from "@/components/YieldChart";
import {
  Sprout,
  TrendingUp,
  CloudSun,
  History,
  ArrowRight,
  Leaf,
  Droplets,
  Sun,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-secondary/50 via-background to-accent/10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjg4MjIiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sprout className="h-4 w-4" />
              AI-Powered Agriculture
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Smart Crop Yield
              <span className="block text-gradient">Predictions</span>
            </h1>
            
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Leverage machine learning to predict your crop yields with precision. 
              Make data-driven decisions for a more profitable harvest.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to="/predict">
                <Button size="lg" variant="hero">
                  Start Prediction
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/history">
                <Button size="lg" variant="outline">
                  View History
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute -bottom-6 left-10 hidden h-24 w-24 rounded-2xl bg-primary/20 blur-2xl md:block" />
        <div className="absolute -top-6 right-10 hidden h-32 w-32 rounded-full bg-accent/20 blur-2xl md:block" />
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="animate-slide-up stagger-1">
            <StatCard
              title="Total Predictions"
              value="1,247"
              subtitle="This month"
              icon={TrendingUp}
              trend={{ value: 12.5, isPositive: true }}
              variant="primary"
            />
          </div>
          <div className="animate-slide-up stagger-2">
            <StatCard
              title="Avg. Yield"
              value="5,420"
              subtitle="kg/hectare"
              icon={Sprout}
              trend={{ value: 8.2, isPositive: true }}
              variant="secondary"
            />
          </div>
          <div className="animate-slide-up stagger-3">
            <StatCard
              title="Weather Score"
              value="82%"
              subtitle="Favorable conditions"
              icon={CloudSun}
              variant="accent"
            />
          </div>
          <div className="animate-slide-up stagger-4">
            <StatCard
              title="Predictions Today"
              value="34"
              subtitle="Active farmers"
              icon={History}
              variant="default"
            />
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Yield Trends */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Yield Trends</h2>
                <p className="text-sm text-muted-foreground">Monthly crop performance</p>
              </div>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            <YieldChart type="area" />
          </div>

          {/* Crop Comparison */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Crop Comparison</h2>
                <p className="text-sm text-muted-foreground">Actual vs target yields</p>
              </div>
              <Button variant="ghost" size="sm">
                Details
              </Button>
            </div>
            <YieldChart type="bar" />
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="mb-8 text-2xl font-bold text-foreground">Quick Actions</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link to="/predict" className="group">
            <div className="hover-lift rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Sprout className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">New Prediction</h3>
              <p className="text-sm text-muted-foreground">
                Calculate expected yield for your crops using AI
              </p>
            </div>
          </Link>

          <Link to="/weather" className="group">
            <div className="hover-lift rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent/50">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <Sun className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Weather Insights</h3>
              <p className="text-sm text-muted-foreground">
                Check weather conditions for optimal planting
              </p>
            </div>
          </Link>

          <Link to="/recommendations" className="group">
            <div className="hover-lift rounded-2xl border border-border bg-card p-6 transition-all hover:border-secondary-foreground/50">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <Leaf className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                Get crop and fertilizer suggestions
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Weather Widget */}
      <section className="container mx-auto px-4 py-12">
        <div className="rounded-2xl border border-border bg-gradient-to-r from-secondary/30 to-accent/10 p-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/20">
                <Sun className="h-10 w-10 text-accent" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">28°C</h3>
                <p className="text-muted-foreground">Current Weather • Partly Cloudy</p>
              </div>
            </div>
            
            <div className="flex gap-8">
              <div className="text-center">
                <Droplets className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="text-lg font-semibold text-foreground">65%</p>
                <p className="text-xs text-muted-foreground">Humidity</p>
              </div>
              <div className="text-center">
                <CloudSun className="mx-auto mb-2 h-6 w-6 text-accent" />
                <p className="text-lg font-semibold text-foreground">12mm</p>
                <p className="text-xs text-muted-foreground">Rainfall</p>
              </div>
            </div>

            <Link to="/weather">
              <Button variant="warm">
                View Details
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
