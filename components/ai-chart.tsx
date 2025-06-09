"use client"

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export function AIChart({ type = "all" }) {
  // Mock Data
  const accuracyData = [
    { name: "Model A", accuracy: 92 },
    { name: "Model B", accuracy: 88 },
    { name: "Model C", accuracy: 95 },
    { name: "Model D", accuracy: 89 },
  ]

  const processingTimeData = [
    { month: "Jan", time: 120 },
    { month: "Feb", time: 110 },
    { month: "Mar", time: 100 },
    { month: "Apr", time: 90 },
    { month: "May", time: 85 },
    { month: "Jun", time: 80 },
  ]

  const confidenceScoreData = [
    { name: "High", value: 400 },
    { name: "Medium", value: 300 },
    { name: "Low", value: 300 },
    { name: "Very Low", value: 200 },
  ]

  const reportVolumeData = [
    { month: "Jan", volume: 1000 },
    { month: "Feb", volume: 1100 },
    { month: "Mar", volume: 1250 },
    { month: "Apr", volume: 1400 },
    { month: "May", volume: 1600 },
    { month: "Jun", volume: 1800 },
  ]

  return (
    <div className="flex flex-col gap-5 p-5">
      {(type === "all" || type === "accuracy") && (
        <div>
          <h3 className="text-lg font-medium mb-2">AI Model Accuracy</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={accuracyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[80, 100]} tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Bar dataKey="accuracy" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {(type === "all" || type === "processing") && (
        <div>
          <h3 className="text-lg font-medium mb-2">Processing Time Improvement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={processingTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="time"
                stroke="hsl(var(--primary))"
                name="Processing Time (ms)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {(type === "all" || type === "confidence") && (
        <div>
          <h3 className="text-lg font-medium mb-2">Confidence Score Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={confidenceScoreData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="hsl(var(--primary))"
                label
              >
                {confidenceScoreData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {(type === "all" || type === "volume") && (
        <div>
          <h3 className="text-lg font-medium mb-2">Monthly Report Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={reportVolumeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary) / 0.2)"
                name="Report Volume"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
