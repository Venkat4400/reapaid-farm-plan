import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Leaf,
  Sprout,
  Beaker,
  Star,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Info,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useRecommendations } from "@/hooks/useRecommendations";
import { toast } from "@/hooks/use-toast";

const regions = [
  { value: "North India", label: "North India" },
  { value: "South India", label: "South India" },
  { value: "East India", label: "East India" },
  { value: "West India", label: "West India" },
  { value: "Central India", label: "Central India" },
];

const soilTypes = [
  { value: "Loamy", label: "Loamy" },
  { value: "Clay", label: "Clay" },
  { value: "Sandy", label: "Sandy" },
  { value: "Silt", label: "Silt" },
];

const seasons = [
  { value: "Rabi", label: "Rabi (Winter)" },
  { value: "Kharif", label: "Kharif (Monsoon)" },
  { value: "Zaid", label: "Zaid (Summer)" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "optimal":
      return "text-primary";
    case "low":
      return "text-destructive";
    case "high":
      return "text-accent";
    default:
      return "text-muted-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "optimal":
      return <CheckCircle className="h-5 w-5 text-primary" />;
    case "low":
      return <AlertTriangle className="h-5 w-5 text-destructive" />;
    case "high":
      return <Info className="h-5 w-5 text-accent" />;
    default:
      return null;
  }
};

export default function Recommendations() {
  const [activeTab, setActiveTab] = useState<"crop" | "fertilizer">("crop");
  const [region, setRegion] = useState("North India");
  const [soilType, setSoilType] = useState("Loamy");
  const [season, setSeason] = useState("Rabi");
  
  const { data, isLoading, error, fetchRecommendations } = useRecommendations();

  useEffect(() => {
    fetchRecommendations({ region, soilType, season });
  }, []);

  const handleRefresh = () => {
    fetchRecommendations({ region, soilType, season });
    toast({
      title: "Recommendations Updated",
      description: "AI has generated new recommendations based on current conditions.",
    });
  };

  const handleFiltersChange = () => {
    fetchRecommendations({ region, soilType, season });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Smart Recommendations</h1>
                <p className="text-muted-foreground">AI-powered crop and fertilizer suggestions</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <Select value={region} onValueChange={(v) => { setRegion(v); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((r) => (
                <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={soilType} onValueChange={(v) => { setSoilType(v); }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Soil Type" />
            </SelectTrigger>
            <SelectContent>
              {soilTypes.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={season} onValueChange={(v) => { setSeason(v); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Season" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleFiltersChange} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sprout className="h-4 w-4" />}
            Generate
          </Button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8 flex gap-2 rounded-xl bg-muted p-1">
          <Button
            variant={activeTab === "crop" ? "default" : "ghost"}
            className={cn(
              "flex-1",
              activeTab === "crop" && "bg-primary text-primary-foreground"
            )}
            onClick={() => setActiveTab("crop")}
          >
            <Sprout className="h-4 w-4" />
            Crop Recommendations
          </Button>
          <Button
            variant={activeTab === "fertilizer" ? "default" : "ghost"}
            className={cn(
              "flex-1",
              activeTab === "fertilizer" && "bg-primary text-primary-foreground"
            )}
            onClick={() => setActiveTab("fertilizer")}
          >
            <Beaker className="h-4 w-4" />
            Fertilizer Guide
          </Button>
        </div>

        {isLoading && !data ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : data ? (
          <>
            {/* Crop Recommendations */}
            {activeTab === "crop" && (
              <div className="space-y-6 animate-fade-in">
                <div className="rounded-2xl border border-border bg-gradient-to-br from-secondary/30 to-primary/10 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                      <Leaf className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Best Crops for Your Farm</h2>
                      <p className="text-sm text-muted-foreground">
                        Based on your region, soil type, and current weather conditions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary">Region: {data.context?.region || region}</Badge>
                    <Badge variant="secondary">Soil: {data.context?.soilType || soilType}</Badge>
                    <Badge variant="secondary">Season: {data.context?.season || season}</Badge>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {data.cropRecommendations?.map((crop, index) => (
                    <div
                      key={crop.name}
                      className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{crop.icon}</span>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">{crop.name}</h3>
                            <Badge variant="outline" className="mt-1">
                              {crop.season}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-accent fill-accent" />
                            <span className="text-lg font-bold text-foreground">{crop.confidence}%</span>
                          </div>
                          <span className="text-xs text-muted-foreground">confidence</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Expected Yield</p>
                          <p className="font-semibold text-primary">{crop.expectedYield}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Recommendation Reason</p>
                          <p className="text-sm text-foreground">{crop.reason}</p>
                        </div>
                      </div>

                      <Link to="/predict">
                        <Button variant="ghost" size="sm" className="mt-4 w-full justify-between group-hover:text-primary">
                          Predict Yield
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Action Items */}
                {data.actionItems && data.actionItems.length > 0 && (
                  <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="mb-4 font-semibold text-foreground">Recommended Actions</h3>
                    <ul className="space-y-3">
                      {data.actionItems.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="mt-0.5 h-5 w-5 text-primary shrink-0" />
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Fertilizer Recommendations */}
            {activeTab === "fertilizer" && (
              <div className="space-y-6 animate-fade-in">
                <div className="rounded-2xl border border-border bg-gradient-to-br from-accent/20 to-secondary/30 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                      <Beaker className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">NPK Fertilizer Guide</h2>
                      <p className="text-sm text-muted-foreground">
                        Optimize soil nutrients for maximum crop yield
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  {data.fertilizerRecommendations?.map((item, index) => (
                    <div
                      key={item.nutrient}
                      className="rounded-xl border border-border bg-card p-6 animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-foreground">{item.nutrient}</h3>
                        {getStatusIcon(item.status)}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Current Level</span>
                            <span className={cn("font-medium", getStatusColor(item.status))}>
                              {item.current}%
                            </span>
                          </div>
                          <Progress 
                            value={item.current} 
                            className="h-2"
                          />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Recommended</span>
                          <span className="font-medium text-primary">{item.recommended}%</span>
                        </div>

                        <div className="rounded-lg bg-muted/50 p-3">
                          <p className="text-sm text-muted-foreground">{item.tip}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fertilizer Application Tips */}
                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="mb-4 font-semibold text-foreground">Application Guidelines</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 text-primary shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        Apply nitrogen fertilizers in split doses - 50% at planting, 50% after 30 days
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 text-primary shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        Phosphorus is best applied at the time of land preparation
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 text-primary shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        Potassium helps with disease resistance - apply before expected stress periods
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="mt-0.5 h-5 w-5 text-accent shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        Avoid over-fertilization as it can harm soil health and water quality
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
