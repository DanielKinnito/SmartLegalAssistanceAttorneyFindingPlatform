"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", clients: 400, attorneys: 240 },
  { name: "Feb", clients: 300, attorneys: 139 },
  { name: "Mar", clients: 200, attorneys: 980 },
  { name: "Apr", clients: 278, attorneys: 390 },
  { name: "May", clients: 189, attorneys: 480 },
  { name: "Jun", clients: 239, attorneys: 380 },
  { name: "Jul", clients: 349, attorneys: 430 },
  { name: "Aug", clients: 349, attorneys: 430 },
  { name: "Sep", clients: 349, attorneys: 430 },
]

export function DashboardChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="name" className="text-sm text-muted-foreground" tickLine={false} axisLine={false} />
        <YAxis
          className="text-sm text-muted-foreground"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Line type="monotone" dataKey="clients" stroke="#06b6d4" strokeWidth={2} activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="attorneys" stroke="#0ea5e9" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}
