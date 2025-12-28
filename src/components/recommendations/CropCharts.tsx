import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import { CropInfo, cropCategories } from "@/data/cropData";

interface CropChartsProps {
  recommendations: (CropInfo & { score?: number })[];
}

const COLORS = [
  "hsl(142, 45%, 42%)",
  "hsl(48, 85%, 65%)",
  "hsl(32, 90%, 55%)",
  "hsl(200, 70%, 50%)",
  "hsl(280, 60%, 55%)",
  "hsl(0, 70%, 55%)",
];

export function CropCharts({ recommendations }: CropChartsProps) {
  // Bar chart: Crop vs Expected Yield
  const yieldData = recommendations.slice(0, 5).map((crop) => {
    const yieldStr = crop.yieldRange.split("-")[1] || crop.yieldRange;
    const yieldNum = parseInt(yieldStr.replace(/[^\d]/g, "")) || 5000;
    return {
      name: crop.name.length > 8 ? crop.name.slice(0, 8) + "..." : crop.name,
      yield: yieldNum,
      icon: crop.icon,
    };
  });

  // Pie chart: Category distribution
  const categoryCount = recommendations.reduce((acc, crop) => {
    acc[crop.category] = (acc[crop.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryCount).map(([category, count]) => {
    const cat = cropCategories.find((c) => c.id === category);
    return {
      name: cat?.name || category,
      value: count,
      icon: cat?.icon || "🌱",
    };
  });

  // Line chart: Rainfall vs Suitability
  const rainfallData = [
    { rainfall: "Low (<500mm)", suitable: recommendations.filter((c) => c.rainfall === "low").length * 20 },
    { rainfall: "Medium (500-1000mm)", suitable: recommendations.filter((c) => c.rainfall === "medium").length * 20 },
    { rainfall: "High (>1000mm)", suitable: recommendations.filter((c) => c.rainfall === "high").length * 20 },
  ];

  const chartConfig = {
    yield: { label: "Yield (kg/ha)", color: "hsl(var(--primary))" },
    suitable: { label: "Crop Suitability", color: "hsl(var(--primary))" },
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Bar Chart - Yield Comparison */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Expected Yield Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <BarChart data={yieldData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 11 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="yield" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Pie Chart - Category Distribution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Crop Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {pieData.map((entry, idx) => (
              <div key={entry.name} className="flex items-center gap-1 text-xs">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span>{entry.icon} {entry.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Line Chart - Rainfall Suitability */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Rainfall vs Suitability</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <LineChart data={rainfallData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="rainfall" tick={{ fontSize: 9 }} />
              <YAxis hide />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="suitable"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
