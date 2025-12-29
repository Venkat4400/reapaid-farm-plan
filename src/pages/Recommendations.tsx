import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Sprout,
  Beaker,
  BarChart3,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SmartInputForm, SmartInputData } from "@/components/recommendations/SmartInputForm";
import { CropRecommendationCard } from "@/components/recommendations/CropRecommendationCard";
import { FertilizerGuide } from "@/components/recommendations/FertilizerGuide";
import { CropCharts } from "@/components/recommendations/CropCharts";
import { getSmartCropRecommendations } from "@/lib/cropRecommendationEngine";
import { CropInfo } from "@/data/cropData";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

export default function Recommendations() {
  const [activeTab, setActiveTab] = useState<"crops" | "fertilizer" | "charts">("crops");
  const [isBeginnerMode, setIsBeginnerMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<(CropInfo & { score: number; matchReasons: string[] })[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<CropInfo | undefined>();
  const [hasSearched, setHasSearched] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (data: SmartInputData) => {
    setIsLoading(true);
    // Simulate API delay for better UX
    await new Promise((r) => setTimeout(r, 800));
    
    const results = getSmartCropRecommendations(data);
    setRecommendations(results);
    setHasSearched(true);
    setIsLoading(false);
    
    if (results.length > 0) {
      setSelectedCrop(results[0]);
    }
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
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  {t("rec.title")}
                </h1>
                <p className="text-muted-foreground">
                  {t("rec.subtitle")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSelector />
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="beginner-mode" className="text-sm cursor-pointer">
                  {isBeginnerMode ? t("rec.beginner_mode") : t("rec.advanced_mode")}
                </Label>
                <Switch
                  id="beginner-mode"
                  checked={isBeginnerMode}
                  onCheckedChange={setIsBeginnerMode}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Input Form */}
        <div className="mb-8">
          <SmartInputForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            isBeginnerMode={isBeginnerMode}
          />
        </div>

        {/* Results Section */}
        {hasSearched && (
          <>
            {/* Tab Navigation */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="crops" className="flex items-center gap-2">
                  <Sprout className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("rec.crops_tab")}</span>
                  <span className="sm:hidden">Crops</span>
                  {recommendations.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {recommendations.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="charts" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("rec.charts_tab")}</span>
                  <span className="sm:hidden">Charts</span>
                </TabsTrigger>
                <TabsTrigger value="fertilizer" className="flex items-center gap-2">
                  <Beaker className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("rec.fertilizer_tab")}</span>
                  <span className="sm:hidden">Fertilizer</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="crops" className="mt-6">
                {recommendations.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {recommendations.map((crop, idx) => (
                      <div key={crop.name} onClick={() => setSelectedCrop(crop)} className="cursor-pointer">
                        <CropRecommendationCard
                          crop={crop}
                          rank={idx + 1}
                          isBeginnerMode={isBeginnerMode}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Sprout className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      No suitable crops found for your conditions. Try adjusting your inputs.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="charts" className="mt-6">
                {recommendations.length > 0 ? (
                  <CropCharts recommendations={recommendations} />
                ) : (
                  <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Charts will appear after you get crop recommendations.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="fertilizer" className="mt-6">
                <FertilizerGuide
                  selectedCrop={selectedCrop}
                  isBeginnerMode={isBeginnerMode}
                />
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Initial State */}
        {!hasSearched && (
          <div className="text-center py-12 rounded-xl border border-dashed border-border">
            <Sprout className="h-16 w-16 mx-auto text-primary/50 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {t("rec.top_recommendations")}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {t("rec.no_results")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
