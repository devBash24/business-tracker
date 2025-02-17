'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import {
  DollarSign,
  CreditCard,
  Package,
  TrendingUp,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardData {
  totalRevenue: number
  totalExpenses: number
  totalOrders: number
  currentFunding: number
  recentTransactions: {
    type: 'revenue' | 'expense'
    amount: number
    description: string
    date: string
  }[]
}

const defaultData: DashboardData = {
  totalRevenue: 0,
  totalExpenses: 0,
  totalOrders: 0,
  currentFunding: 0,
  recentTransactions: []
}

export function DashboardMetrics() {
  const [data, setData] = useState<DashboardData>(defaultData)
  const [loading, setLoading] = useState(true)
  const [showFunding, setShowFunding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/dashboard')
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      
      const dashboardData = await response.json()
      
      // Ensure all required properties exist
      setData({
        totalRevenue: dashboardData.totalRevenue ?? 0,
        totalExpenses: dashboardData.totalExpenses ?? 0,
        totalOrders: dashboardData.totalOrders ?? 0,
        currentFunding: dashboardData.currentFunding ?? 0,
        recentTransactions: dashboardData.recentTransactions ?? []
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError(error instanceof Error ? error.message : 'Failed to load dashboard data')
      setData(defaultData)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <DashboardSkeleton />
  if (error) return <div className="text-red-500">Error: {error}</div>

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
    >
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
              `$${data.currentFunding.toFixed(2)}`
            ) : (
              '••••••'
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Updated with latest transactions
          </p>
        </CardContent>
      </Card>

      {/* Revenue Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${data.totalRevenue.toFixed(2)}</div>
          <div className="flex items-center pt-1">
            <ArrowUp className="h-3 w-3 text-green-500" />
            <span className="text-xs text-muted-foreground ml-1">
              Added to funding
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${data.totalExpenses.toFixed(2)}</div>
          <div className="flex items-center pt-1">
            <ArrowDown className="h-3 w-3 text-red-500" />
            <span className="text-xs text-muted-foreground ml-1">
              Deducted from funding
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Orders Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalOrders}</div>
          <p className="text-xs text-muted-foreground">
            Lifetime orders
          </p>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentTransactions.map((transaction, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'revenue' 
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'revenue' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(transaction.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <p className={`font-bold ${
                  transaction.type === 'revenue'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {transaction.type === 'revenue' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="space-y-0 pb-2">
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="mt-2 h-4 w-36" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 