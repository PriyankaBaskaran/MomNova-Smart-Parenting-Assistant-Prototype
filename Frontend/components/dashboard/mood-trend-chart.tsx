"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts"

interface MoodData {
  day: string
  score: number
  fullDate: string
}

interface MoodTrendChartProps {
  data: MoodData[]
}

const chartConfig = {
  score: {
    label: "Mood Score",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function MoodTrendChart({ data }: MoodTrendChartProps) {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Mood Trend</CardTitle>
        <CardDescription>Your emotional journey over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
            <XAxis 
              dataKey="day" 
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <YAxis 
              domain={[0, 1]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              className="text-muted-foreground"
            />
            <ChartTooltip 
              content={
                <ChartTooltipContent 
                  formatter={(value) => [`${((value as number) * 100).toFixed(0)}%`, "Mood"]}
                  labelKey="fullDate"
                />
              }
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2.5}
              fill="url(#moodGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
