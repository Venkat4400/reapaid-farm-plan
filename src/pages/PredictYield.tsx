import { useState } from "react";
import { CropForm } from "@/components/CropForm";
import { ResultCard } from "@/components/ResultCard";
import { Button } from "@/components/ui/button";
import { Sprout, Lightbulb, ArrowLeft, History } from "lucide-react";
import { Link } from "react-router-dom";

interface PredictionResult {
  yield: number;
  crop: string;
  confidence: number;
  temperature?: number;
  rainfall?: number;
}

export default function PredictYield() {
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handlePredict = (formData: any) => {
    // Simulate ML prediction result
    const baseYield = Math.floor(Math.random() * 3000) + 3500;
    const confidence = Math.floor(Math.random() * 20) + 75;
    
    setResult({
      yield: baseYield,
      crop: formData.crop,
      confidence,
      temperature: formData.temperature ? parseInt(formData.temperature) : 28,
      rainfall: formData.rainfall ? parseInt(formData.rainfall) : 120,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Predict Crop Yield</h1>
              <p className="text-muted-foreground">Enter your crop and environmental details</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Form Section */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                  <Sprout className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Crop Details</h2>
                  <p className="text-sm text-muted-foreground">
                    Fill in the information below for accurate prediction
                  </p>
                </div>
              </div>
              
              <CropForm onPredict={handlePredict} />
            </div>

            {/* Tips Section */}
            <div className="mt-6 rounded-2xl border border-border bg-secondary/30 p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                  <Lightbulb className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Tips for Accurate Predictions</h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li>• Use recent weather data for better accuracy</li>
                    <li>• Soil type significantly affects yield - choose carefully</li>
                    <li>• Consider historical data from your region</li>
                    <li>• Update predictions as conditions change</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-2">
            {result ? (
              <div className="space-y-6 animate-slide-up">
                <ResultCard
                  predictedYield={result.yield}
                  crop={result.crop}
                  confidence={result.confidence}
                  additionalInfo={{
                    temperature: result.temperature,
                    rainfall: result.rainfall,
                    optimalRange: "3.5k-6.5k",
                  }}
                />
                
                <div className="rounded-xl border border-border bg-card p-4">
                  <h4 className="mb-3 font-medium text-foreground">Recommendations</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      Consider increasing irrigation during dry spells
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      Apply NPK fertilizer in recommended ratios
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      Monitor for pests during humid conditions
                    </li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    <History className="h-4 w-4" />
                    Save to History
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="flex-1"
                    onClick={() => setResult(null)}
                  >
                    New Prediction
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                  <Sprout className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">No Prediction Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Fill in the form and click "Predict Crop Yield" to see your results here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
