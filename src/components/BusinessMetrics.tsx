'use client'

import { useState, useEffect } from 'react'

interface BusinessMetrics {
  revenue: number
  expenses: number
  profit: number
}

export default function BusinessMetrics() {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/metrics')
      if (!response.ok) throw new Error('Failed to fetch metrics')
      const data = await response.json()
      setMetrics(data)
    } catch (error) {
      console.error('Error fetching metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center">Loading metrics...</div>
  }

  if (!metrics) {
    return <div className="text-center">No metrics available</div>
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Business Metrics</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-green-700">Revenue</h3>
          <p className="text-2xl font-bold text-green-800">
            ${metrics.revenue.toFixed(2)}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-red-700">Expenses</h3>
          <p className="text-2xl font-bold text-red-800">
            ${metrics.expenses.toFixed(2)}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-blue-700">Profit</h3>
          <p className="text-2xl font-bold text-blue-800">
            ${metrics.profit.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
} 