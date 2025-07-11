import * as React from "react"
import {
  ResponsiveContainer as RechartsResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
} from "recharts"

export const Bar = require("recharts").Bar
export const BarChart = require("recharts").BarChart
export const CartesianGrid = require("recharts").CartesianGrid
export const Cell = require("recharts").Cell
export const Line = require("recharts").Line
export const LineChart = require("recharts").LineChart
export const Pie = require("recharts").Pie
export const PieChart = require("recharts").PieChart
export const XAxis = require("recharts").XAxis
export const YAxis = require("recharts").YAxis

export const ResponsiveContainer = ({ children, ...props }: any) => (
  <RechartsResponsiveContainer {...props}>{children}</RechartsResponsiveContainer>
)

export const Tooltip = (props: any) => <RechartsTooltip {...props} />
export const Legend = (props: any) => <RechartsLegend {...props} />

export interface ChartConfig {
  [key: string]: {
    label: string
    color?: string
    icon?: React.ReactNode
    theme?: {
      light: string
      dark: string
    }
  }
}

export function ChartContainer({ children, config, className }: { children: React.ReactNode; config?: ChartConfig; className?: string }) {
  return (
    <div className={className} style={{ width: "100%", minHeight: 200 }}>{children}</div>
  )
}

export function ChartTooltip({ content, ...props }: any) {
  return <Tooltip {...props} content={content} />
}

export function ChartTooltipContent({ labelKey, nameKey, ...props }: any) {
  // This is a simple tooltip content for demonstration. You can customize it as needed.
  return (
    <div className="bg-background border border-border rounded-lg p-2 shadow-xl text-xs">
      {props.label && <div className="font-medium mb-1">{props.label}</div>}
      {props.payload && props.payload.length > 0 && (
        <ul className="space-y-1">
          {props.payload.map((item: any, idx: number) => (
            <li key={idx} className="flex items-center justify-between">
              <span>{item.name}</span>
              <span className="font-mono font-semibold">{item.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function ChartLegend({ content, ...props }: any) {
  return <Legend {...props} content={content} />
}

export function ChartLegendContent({ nameKey, ...props }: any) {
  // This is a simple legend content for demonstration. You can customize it as needed.
  const { payload } = props
  return (
    <ul className="flex flex-wrap gap-2 mt-2">
      {payload && payload.map((entry: any, idx: number) => (
        <li key={idx} className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full" style={{ background: entry.color }} />
          <span className="text-xs">{entry.value}</span>
        </li>
      ))}
    </ul>
  )
}
