import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const yieldData = [
  { month: "Jan", wheat: 4200, rice: 3800, corn: 4100 },
  { month: "Feb", wheat: 4400, rice: 4000, corn: 4300 },
  { month: "Mar", wheat: 4800, rice: 4200, corn: 4600 },
  { month: "Apr", wheat: 5200, rice: 4600, corn: 5000 },
  { month: "May", wheat: 5800, rice: 5200, corn: 5400 },
  { month: "Jun", wheat: 6200, rice: 5800, corn: 6000 },
  { month: "Jul", wheat: 6000, rice: 5600, corn: 5800 },
  { month: "Aug", wheat: 5800, rice: 5400, corn: 5600 },
  { month: "Sep", wheat: 5400, rice: 5000, corn: 5200 },
  { month: "Oct", wheat: 5000, rice: 4600, corn: 4800 },
  { month: "Nov", wheat: 4600, rice: 4200, corn: 4400 },
  { month: "Dec", wheat: 4400, rice: 4000, corn: 4200 },
];

const cropComparison = [
  { name: "Wheat", yield: 5200, target: 5500 },
  { name: "Rice", yield: 4800, target: 5000 },
  { name: "Corn", yield: 5100, target: 5200 },
  { name: "Soybean", yield: 3800, target: 4000 },
  { name: "Potato", yield: 6200, target: 6000 },
];

interface YieldChartProps {
  type?: "area" | "bar";
}

export function YieldChart({ type = "area" }: YieldChartProps) {
  if (type === "bar") {
    return (
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={cropComparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="name"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 24px hsl(var(--foreground) / 0.1)",
              }}
              formatter={(value: number) => [`${value.toLocaleString()} kg/ha`, ""]}
            />
            <Legend />
            <Bar
              dataKey="yield"
              name="Actual Yield"
              fill="hsl(var(--chart-green))"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="target"
              name="Target Yield"
              fill="hsl(var(--chart-yellow))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={yieldData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorWheat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-green))" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(var(--chart-green))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorRice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-yellow))" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(var(--chart-yellow))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorCorn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-orange))" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(var(--chart-orange))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="month"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 24px hsl(var(--foreground) / 0.1)",
            }}
            formatter={(value: number) => [`${value.toLocaleString()} kg/ha`, ""]}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="wheat"
            name="Wheat"
            stroke="hsl(var(--chart-green))"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorWheat)"
          />
          <Area
            type="monotone"
            dataKey="rice"
            name="Rice"
            stroke="hsl(var(--chart-yellow))"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorRice)"
          />
          <Area
            type="monotone"
            dataKey="corn"
            name="Corn"
            stroke="hsl(var(--chart-orange))"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCorn)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
