import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

interface MetricsChartProps {
  title: string;
  data: ChartDataPoint[];
  type: "line" | "bar" | "pie";
  dataKey?: string;
  color?: string;
  height?: number;
}

const CHART_COLORS = ['hsl(235, 85%, 65%)', 'hsl(141, 76%, 48%)', 'hsl(0, 95%, 60%)', 'hsl(315, 100%, 65%)', 'hsl(221, 83%, 53%)'];

export function MetricsChart({ 
  title, 
  data, 
  type, 
  dataKey = "value", 
  color = "hsl(235, 85%, 65%)",
  height = 300 
}: MetricsChartProps) {
  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
            <XAxis dataKey="name" stroke="hsl(220, 15%, 55%)" fontSize={12} />
            <YAxis stroke="hsl(220, 15%, 55%)" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(0, 0%, 100%)', 
                border: '1px solid hsl(220, 13%, 91%)',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-soft)'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={3}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: color }}
            />
          </LineChart>
        );
      
      case "bar":
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
            <XAxis dataKey="name" stroke="hsl(220, 15%, 55%)" fontSize={12} />
            <YAxis stroke="hsl(220, 15%, 55%)" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(0, 0%, 100%)', 
                border: '1px solid hsl(220, 13%, 91%)',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-soft)'
              }} 
            />
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      
      case "pie":
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill={color}
              dataKey={dataKey}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(0, 0%, 100%)', 
                border: '1px solid hsl(220, 13%, 91%)',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-soft)'
              }} 
            />
          </PieChart>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}