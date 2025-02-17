import { Metadata } from "next"
import Dashboard from "@/components/Dashboard"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Dashboard | Business Tracker",
  description: "Business performance at a glance",
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col gap-8 p-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your business performance at a glance
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard/orders/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Order
            </Button>
          </Link>
          <Link href="/dashboard/expenses/new">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              New Expense
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid gap-8">
        <Dashboard />
      </div>

      {/* Quick Access Section */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/orders">
          <div className="group rounded-lg border p-6 hover:border-primary hover:bg-muted/50 transition-all">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
            <p className="text-sm text-muted-foreground">
              View and manage your latest orders
            </p>
            <p className="mt-4 text-sm text-primary group-hover:underline">
              View all orders →
            </p>
          </div>
        </Link>

        <Link href="/dashboard/expenses">
          <div className="group rounded-lg border p-6 hover:border-primary hover:bg-muted/50 transition-all">
            <h3 className="text-lg font-semibold">Expense Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Monitor and manage your expenses
            </p>
            <p className="mt-4 text-sm text-primary group-hover:underline">
              View all expenses →
            </p>
          </div>
        </Link>

        <Link href="/dashboard/analytics">
          <div className="group rounded-lg border p-6 hover:border-primary hover:bg-muted/50 transition-all">
            <h3 className="text-lg font-semibold">Business Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Detailed reports and insights
            </p>
            <p className="mt-4 text-sm text-primary group-hover:underline">
              View analytics →
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
