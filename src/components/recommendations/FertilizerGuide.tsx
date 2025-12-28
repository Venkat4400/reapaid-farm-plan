import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Leaf,
  FlaskConical,
  Clock,
  Scale,
  Info,
} from "lucide-react";
import { CropInfo, fertilizers, nutrientExplanations } from "@/data/cropData";
import { cn } from "@/lib/utils";

interface FertilizerGuideProps {
  selectedCrop?: CropInfo;
  isBeginnerMode?: boolean;
}

export function FertilizerGuide({
  selectedCrop,
  isBeginnerMode = true,
}: FertilizerGuideProps) {
  const [activeTab, setActiveTab] = useState<"organic" | "chemical">("organic");

  const organicFertilizers = fertilizers.filter((f) => f.type === "organic");
  const chemicalFertilizers = fertilizers.filter((f) => f.type === "chemical");

  return (
    <div className="space-y-6">
      {/* NPK Explanation for Beginners */}
      {isBeginnerMode && (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <HelpCircle className="h-5 w-5 text-primary" />
              What is NPK? (Simple Explanation)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              NPK stands for <strong>Nitrogen (N)</strong>,{" "}
              <strong>Phosphorus (P)</strong>, and <strong>Potassium (K)</strong>.
              These are the three main nutrients that plants need to grow healthy.
              Think of them as vitamins for plants!
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {Object.entries(nutrientExplanations).map(([key, nutrient]) => (
                <div
                  key={key}
                  className="rounded-xl bg-card p-4 border border-border"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-2xl">{nutrient.icon}</span>
                    <div>
                      <p className="font-bold text-foreground">
                        {key.charAt(0).toUpperCase() + key.slice(1)} ({nutrient.symbol})
                      </p>
                    </div>
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {nutrient.simpleExplanation}
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-3 w-3 text-destructive shrink-0" />
                      <span className="text-muted-foreground">
                        <strong>Too little:</strong> {nutrient.deficiencySign}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Info className="mt-0.5 h-3 w-3 text-amber-500 shrink-0" />
                      <span className="text-muted-foreground">
                        <strong>Too much:</strong> {nutrient.excessSign}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Crop-specific fertilizer if selected */}
      {selectedCrop && (
        <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="text-2xl">{selectedCrop.icon}</span>
              Fertilizer Guide for {selectedCrop.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-2 font-medium text-foreground flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-green-600" />
                  Organic Options
                </p>
                <ul className="space-y-1">
                  {selectedCrop.fertilizers.organic.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-3 w-3 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 font-medium text-foreground flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-blue-600" />
                  Chemical Fertilizers
                </p>
                <div className="space-y-2">
                  {selectedCrop.fertilizers.chemical.map((f, idx) => (
                    <div key={idx} className="rounded-lg bg-muted/50 p-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{f.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {f.quantity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {f.timing}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fertilizer Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "organic" | "chemical")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="organic" className="flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            Organic (Natural)
          </TabsTrigger>
          <TabsTrigger value="chemical" className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4" />
            Chemical
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organic" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {organicFertilizers.map((fert) => (
              <FertilizerCard key={fert.name} fertilizer={fert} isBeginnerMode={isBeginnerMode} />
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-green-50 dark:bg-green-950/30 p-4 border border-green-200 dark:border-green-800">
            <p className="flex items-start gap-2 text-sm text-green-800 dark:text-green-300">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <strong>Tip:</strong> Organic fertilizers improve soil health over time. They are
                safe for the environment and make your soil better each year!
              </span>
            </p>
          </div>
        </TabsContent>

        <TabsContent value="chemical" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {chemicalFertilizers.map((fert) => (
              <FertilizerCard key={fert.name} fertilizer={fert} isBeginnerMode={isBeginnerMode} />
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 p-4 border border-amber-200 dark:border-amber-800">
            <p className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <strong>Warning:</strong> Use chemical fertilizers carefully. Too much can damage
                crops and pollute water. Always follow recommended quantities!
              </span>
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface FertilizerCardProps {
  fertilizer: (typeof fertilizers)[0];
  isBeginnerMode?: boolean;
}

function FertilizerCard({ fertilizer, isBeginnerMode }: FertilizerCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{fertilizer.icon}</span>
            <div>
              <CardTitle className="text-base">{fertilizer.name}</CardTitle>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs mt-1",
                  fertilizer.type === "organic"
                    ? "border-green-500 text-green-600"
                    : "border-blue-500 text-blue-600"
                )}
              >
                {fertilizer.nutrient}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{fertilizer.description}</p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2">
            <Scale className="h-4 w-4 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Quantity per acre</p>
              <p className="text-sm font-medium">{fertilizer.applicationRate}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2">
            <Clock className="h-4 w-4 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">When to apply</p>
              <p className="text-sm font-medium">{fertilizer.timing}</p>
            </div>
          </div>
        </div>

        {isBeginnerMode && (
          <>
            <div>
              <p className="text-xs font-medium text-foreground mb-1">Benefits:</p>
              <ul className="space-y-1">
                {fertilizer.benefits.slice(0, 3).map((benefit, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="h-3 w-3 text-primary shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {fertilizer.warnings.length > 0 && (
              <div className="rounded-lg bg-destructive/10 p-2">
                <p className="text-xs font-medium text-destructive mb-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Warnings:
                </p>
                <ul className="space-y-1">
                  {fertilizer.warnings.map((warning, idx) => (
                    <li key={idx} className="text-xs text-destructive/80">
                      • {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
