import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { subDays } from 'date-fns'

export async function GET() {
  try {
    const thirtyDaysAgo = subDays(new Date(), 30)
    const sixtyDaysAgo = subDays(new Date(), 60)

    // Get current period metrics
    const [currentRevenue, currentOrders, currentCustomers] = await Promise.all([
      // Revenue
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: thirtyDaysAgo
          },
          isCompleted: true
        },
        _sum: {
          totalAmount: true
        }
      }),

      // Orders
      prisma.order.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo
          }
        }
      }),

      // Customers
      prisma.order.groupBy({
        by: ['customerName'],
        where: {
          createdAt: {
            gte: thirtyDaysAgo
          }
        }
      })
    ])

    // Get previous period metrics
    const [previousRevenue, previousOrders, previousCustomers] = await Promise.all([
      // Revenue
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo
          },
          isCompleted: true
        },
        _sum: {
          totalAmount: true
        }
      }),

      // Orders
      prisma.order.count({
        where: {
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo
          }
        }
      }),

      // Customers
      prisma.order.groupBy({
        by: ['customerName'],
        where: {
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo
          }
        }
      })
    ])

    // Calculate trends
    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) return 100
      return ((current - previous) / previous) * 100
    }

    const trends = {
      revenue: calculateTrend(
        currentRevenue._sum.totalAmount || 0,
        previousRevenue._sum.totalAmount || 0
      ),
      orders: calculateTrend(currentOrders, previousOrders),
      customers: calculateTrend(currentCustomers.length, previousCustomers.length)
    }

    return NextResponse.json(trends)
  } catch (error) {
    console.error('Dashboard Trends API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trend data' },
      { status: 500 }
    )
  }
} 