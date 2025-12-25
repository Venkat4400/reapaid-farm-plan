import { useState } from "react";
import { CropForm } from "@/components/CropForm";
import { ResultCard } from "@/components/ResultCard";
import { Button } from "@/components/ui/button";
import { Sprout, Lightbulb, ArrowLeft, History, Brain, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

interface PredictionResult {
  yield: number;
  crop: string;
  confidence: number;
  temperature?: number;
  rainfall?: number;
  model_accuracy?: {
    r2_score: number;
    mae: number;
    rmse: number;
  };
}

export default function PredictYield() {
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handlePredict = (formData: any) => {
    setResult({
      yield: formData.yield,
      crop: formData.crop,
      confidence: formData.confidence,
      temperature: formData.temperature ? parseInt(formData.temperature) : 28,
      rainfall: formData.rainfall ? parseInt(formData.rainfall) : 120,
      model_accuracy: formData.model_accuracy,
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
                
                {/* Model Accuracy Card */}
                {result.model_accuracy && (
                  <div className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-foreground">ML Model Accuracy</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 rounded-lg bg-primary/5">
                        <Target className="h-4 w-4 text-primary mx-auto mb-1" />
                        <p className="text-lg font-bold text-primary">
                          {(result.model_accuracy.r2_score * 100).toFixed(1)}%
                        </p>
                        <p className="text-xs text-muted-foreground">R² Score</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-accent/5">
                        <TrendingUp className="h-4 w-4 text-accent mx-auto mb-1" />
                        <p className="text-lg font-bold text-accent">
                          {result.model_accuracy.mae.toFixed(1)}
                        </p>
                        <p className="text-xs text-muted-foreground">MAE</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-secondary">
                        <TrendingUp className="h-4 w-4 text-foreground mx-auto mb-1" />
                        <p className="text-lg font-bold text-foreground">
                          {result.model_accuracy.rmse.toFixed(1)}
                        </p>
                        <p className="text-xs text-muted-foreground">RMSE</p>
                      </div>
                    </div>
                  </div>
                )}
                
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
                  <Link to="/history" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <History className="h-4 w-4" />
                      View History
                    </Button>
                  </Link>
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