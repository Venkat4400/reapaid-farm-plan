import { useState } from "react";
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
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const historyData = [
  {
    id: 1,
    date: "2024-01-15",
    crop: "Wheat",
    region: "North India",
    soil: "Loamy",
    predictedYield: 5420,
    confidence: 89,
    status: "high",
  },
  {
    id: 2,
    date: "2024-01-14",
    crop: "Rice",
    region: "South India",
    soil: "Clay",
    predictedYield: 4850,
    confidence: 85,
    status: "high",
  },
  {
    id: 3,
    date: "2024-01-13",
    crop: "Corn",
    region: "West India",
    soil: "Sandy",
    predictedYield: 3200,
    confidence: 72,
    status: "medium",
  },
  {
    id: 4,
    date: "2024-01-12",
    crop: "Soybean",
    region: "Central India",
    soil: "Silt",
    predictedYield: 2800,
    confidence: 78,
    status: "medium",
  },
  {
    id: 5,
    date: "2024-01-11",
    crop: "Potato",
    region: "North India",
    soil: "Loamy",
    predictedYield: 6100,
    confidence: 92,
    status: "high",
  },
  {
    id: 6,
    date: "2024-01-10",
    crop: "Cotton",
    region: "West India",
    soil: "Sandy",
    predictedYield: 2100,
    confidence: 65,
    status: "low",
  },
  {
    id: 7,
    date: "2024-01-09",
    crop: "Sugarcane",
    region: "South India",
    soil: "Clay",
    predictedYield: 7200,
    confidence: 88,
    status: "high",
  },
  {
    id: 8,
    date: "2024-01-08",
    crop: "Barley",
    region: "East India",
    soil: "Peat",
    predictedYield: 3800,
    confidence: 76,
    status: "medium",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "high":
      return (
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
          <TrendingUp className="mr-1 h-3 w-3" />
          High Yield
        </Badge>
      );
    case "medium":
      return (
        <Badge className="bg-accent/10 text-accent hover:bg-accent/20">
          Medium
        </Badge>
      );
    case "low":
      return (
        <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">
          <TrendingDown className="mr-1 h-3 w-3" />
          Low Yield
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function History() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cropFilter, setCropFilter] = useState("all");

  const filteredData = historyData.filter((item) => {
    const matchesSearch =
      item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = cropFilter === "all" || item.crop.toLowerCase() === cropFilter;
    return matchesSearch && matchesCrop;
  });

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
          <Button variant="outline">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Predictions</p>
            <p className="text-2xl font-bold text-foreground">{historyData.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-primary/5 p-4">
            <p className="text-sm text-muted-foreground">Average Yield</p>
            <p className="text-2xl font-bold text-primary">
              {Math.round(
                historyData.reduce((acc, item) => acc + item.predictedYield, 0) /
                  historyData.length
              ).toLocaleString()}{" "}
              <span className="text-sm font-normal text-muted-foreground">kg/ha</span>
            </p>
          </div>
          <div className="rounded-xl border border-border bg-accent/5 p-4">
            <p className="text-sm text-muted-foreground">Avg. Confidence</p>
            <p className="text-2xl font-bold text-accent">
              {Math.round(
                historyData.reduce((acc, item) => acc + item.confidence, 0) /
                  historyData.length
              )}
              %
            </p>
          </div>
        </div>

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
                  <TableCell className="font-medium">{item.date}</TableCell>
                  <TableCell>
                    <span className="font-medium text-foreground">{item.crop}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.region}</TableCell>
                  <TableCell className="text-muted-foreground">{item.soil}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {item.predictedYield.toLocaleString()} kg/ha
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
                      {item.confidence}%
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredData.length === 0 && (
          <div className="mt-8 text-center text-muted-foreground">
            No predictions found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
