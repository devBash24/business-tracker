import { Metadata } from "next"
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard"

export const metadata: Metadata = {
  title: "Analytics | Business Tracker",
  description: "Business performance analytics and insights",
}

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen flex-col gap-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Track your business performance and insights
        </p>
      </div>

      <AnalyticsDashboard />
    </div>
  )
} 