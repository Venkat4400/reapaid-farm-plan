import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Search,
  Download,
  Trash2,
  TrendingUp,
  TrendingDown,
  Filter,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Prediction {
  id: string;
  created_at: string;
  crop: string;
  region: string;
  soil_type: string;
  predicted_yield: number;
  confidence: number;
  rainfall: number;
  temperature: number;
  humidity: number;
}

const getStatusBadge = (confidence: number) => {
  if (confidence >= 85) {
    return (
      <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
        <TrendingUp className="mr-1 h-3 w-3" />
        High Yield
      </Badge>
    );
  } else if (confidence >= 70) {
    return (
      <Badge className="bg-accent/10 text-accent hover:bg-accent/20">
        Medium
      </Badge>
    );
  } else {
    return (
      <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">
        <TrendingDown className="mr-1 h-3 w-3" />
        Low Yield
      </Badge>
    );
  }
};

export default function History() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cropFilter, setCropFilter] = useState("all");

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("predictions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPredictions(data || []);
    } catch (error) {
      console.error("Error fetching predictions:", error);
      toast({
        title: "Error",
        description: "Failed to load prediction history.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("predictions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setPredictions(predictions.filter((p) => p.id !== id));
      toast({
        title: "Deleted",
        description: "Prediction removed from history.",
      });
    } catch (error) {
      console.error("Error deleting prediction:", error);
      toast({
        title: "Error",
        description: "Failed to delete prediction.",
        variant: "destructive",
      });
    }
  };

  const handleExportCSV = () => {
    if (predictions.length === 0) {
      toast({
        title: "No Data",
        description: "No predictions to export.",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Date", "Crop", "Region", "Soil Type", "Predicted Yield (kg/ha)", "Confidence (%)"];
    const rows = predictions.map((p) => [
      new Date(p.created_at).toLocaleDateString(),
      p.crop,
      p.region,
      p.soil_type,
      p.predicted_yield.toString(),
      p.confidence?.toFixed(1) || "N/A",
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `crop-predictions-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    toast({
      title: "Exported",
      description: "Predictions exported to CSV.",
    });
  };

  const filteredData = predictions.filter((item) => {
    const matchesSearch =
      item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = cropFilter === "all" || item.crop.toLowerCase() === cropFilter;
    return matchesSearch && matchesCrop;
  });

  const avgYield = predictions.length > 0
    ? Math.round(predictions.reduce((acc, item) => acc + item.predicted_yield, 0) / predictions.length)
    : 0;

  const avgConfidence = predictions.length > 0
    ? Math.round(predictions.reduce((acc, item) => acc + (item.confidence || 0), 0) / predictions.length)
    : 0;

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
              <h1 className="text-2xl font-bold text-foreground">Prediction History</h1>
              <p className="text-muted-foreground">View and manage your past predictions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by crop or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={cropFilter} onValueChange={setCropFilter}>
              <SelectTrigger className="w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crops</SelectItem>
                <SelectItem value="wheat">Wheat</SelectItem>
                <SelectItem value="rice">Rice</SelectItem>
                <SelectItem value="corn">Corn</SelectItem>
                <SelectItem value="soybean">Soybean</SelectItem>
                <SelectItem value="potato">Potato</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Predictions</p>
            <p className="text-2xl font-bold text-foreground">{predictions.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-primary/5 p-4">
            <p className="text-sm text-muted-foreground">Average Yield</p>
            <p className="text-2xl font-bold text-primary">
              {avgYield.toLocaleString()}{" "}
              <span className="text-sm font-normal text-muted-foreground">kg/ha</span>
            </p>
          </div>
          <div className="rounded-xl border border-border bg-accent/5 p-4">
            <p className="text-sm text-muted-foreground">Avg. Confidence</p>
            <p className="text-2xl font-bold text-accent">{avgConfidence}%</p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="rounded-xl border border-border bg-card shadow-soft overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Date</TableHead>
                    <TableHead>Crop</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Soil Type</TableHead>
                    <TableHead className="text-right">Predicted Yield</TableHead>
                    <TableHead className="text-center">Confidence</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item, index) => (
                    <TableRow
                      key={item.id}
                      className={cn(
                        "animate-fade-in transition-colors hover:bg-muted/50",
                        index % 2 === 0 ? "bg-background" : "bg-muted/20"
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="font-medium">
                        {new Date(item.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-foreground capitalize">{item.crop}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground capitalize">{item.region.replace(/-/g, " ")}</TableCell>
                      <TableCell className="text-muted-foreground capitalize">{item.soil_type}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {item.predicted_yield.toLocaleString()} kg/ha
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={cn(
                            "font-medium",
                            item.confidence >= 85
                              ? "text-primary"
                              : item.confidence >= 70
                              ? "text-accent"
                              : "text-destructive"
                          )}
                        >
                          {item.confidence?.toFixed(1) || "N/A"}%
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.confidence || 0)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredData.length === 0 && !isLoading && (
              <div className="mt-8 text-center text-muted-foreground">
                {predictions.length === 0
                  ? "No predictions yet. Make your first prediction!"
                  : "No predictions found matching your criteria."}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
