'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MetricCard } from "./dashboard/MetricCard"
import { RecentActivity } from "./dashboard/RecentActivity"
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users,
  Package,
  Eye,
  EyeOff,
  CreditCard
} from "lucide-react"

const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#ef4444', '#8b5cf6']

export default function Dashboard() {
  const [data, setData] = useState<any>(null)
  const [trends, setTrends] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showFunding, setShowFunding] = useState(false)

  useEffect(() => {
    Promise.all([
      fetchDashboardData(),
      fetchTrends()
    ]).finally(() => setLoading(false))
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard')
      if (!response.ok) throw new Error('Failed to fetch dashboard data')
      const data = await response.json()
      setData(data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  const fetchTrends = async () => {
    try {
      const response = await fetch('/api/dashboard/trends')
      if (!response.ok) throw new Error('Failed to fetch trends')
      const data = await response.json()
      setTrends(data)
    } catch (error) {
      console.error('Error fetching trends:', error)
    }
  }

  if (loading || !data) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* First Row - Funding and Revenue */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Current Funding */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Funding</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFunding(!showFunding)}
            >
              {showFunding ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {showFunding ? (
                `$${data.metrics.currentFunding?.toLocaleString() ?? '0'}`
              ) : (
                '••••••'
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Updated with latest transactions
            </p>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <div>
          <MetricCard
            title="Total Revenue"
            value={`$${data.metrics.totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="w-4 h-4" />}
            trend={trends?.revenue ?? 0}
            description="vs. previous 30 days"
          />
        </div>
      </div>

      {/* Second Row - Expenses, Orders, and Pending Orders */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <MetricCard
            title="Total Expenses"
            value={`$${data.metrics.totalExpenses.toLocaleString()}`}
            icon={<CreditCard className="w-4 h-4" />}
            trend={trends?.expenses ?? 0}
            description="vs. previous 30 days"
          />
        </div>
        <div>
          <MetricCard
            title="Total Orders"
            value={data.metrics.totalOrders}
            icon={<ShoppingCart className="w-4 h-4" />}
            trend={trends?.orders ?? 0}
            description="vs. previous 30 days"
          />
        </div>
        <div>
          <MetricCard
            title="Pending Orders"
            value={data.metrics.pendingOrders}
            icon={<Package className="w-4 h-4" />}
            trend={trends?.pendingOrders ?? 0}
            description="vs. previous 30 days"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Overview Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    width={80}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#0ea5e9" 
                    strokeWidth={2}
                    name="Revenue"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Expenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Expenses by Category Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.expensesByCategory}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => 
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {data.expensesByCategory.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="w-full">
        <RecentActivity activities={data.recentActivity} />
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* First Row Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-20 animate-pulse bg-muted rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Second Row Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-20 animate-pulse bg-muted rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-[300px] animate-pulse bg-muted rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity Skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse bg-muted rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 