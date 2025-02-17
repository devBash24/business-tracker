import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'

export async function GET() {
  try {
    // Fetch all required data
    const [orders, expenses, settings] = await Promise.all([
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          orderItems: true,
          additionalFees: true
        }
      }),
      prisma.expense.findMany({
        orderBy: { date: 'desc' },
        take: 10,
        include: {
          items: true
        }
      }),
      prisma.settings.findFirst()
    ])

    // Calculate metrics
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const currentFunding = (settings?.businessFunding || 0) + totalRevenue - totalExpenses
    const pendingOrders = orders.filter(order => !order.isCompleted).length

    // Calculate revenue and expenses by month
    const monthlyData = new Map()
    
    orders.forEach(order => {
      const month = format(order.createdAt, 'MMM yyyy')
      const current = monthlyData.get(month) || { month, revenue: 0, expenses: 0 }
      current.revenue += order.totalAmount
      monthlyData.set(month, current)
    })

    expenses.forEach(expense => {
      const month = format(expense.date, 'MMM yyyy')
      const current = monthlyData.get(month) || { month, revenue: 0, expenses: 0 }
      current.expenses += expense.amount
      monthlyData.set(month, current)
    })

    // Calculate expenses by category
    const expenseCategories = new Map()
    expenses.forEach(expense => {
      const current = expenseCategories.get(expense.category) || 0
      expenseCategories.set(expense.category, current + expense.amount)
    })

    // Combine recent activities
    const recentActivity = [
      ...orders.map(order => ({
        type: 'order',
        title: `New order from ${order.customerName}`,
        amount: order.totalAmount,
        date: order.createdAt,
      })),
      ...expenses.map(expense => ({
        type: 'expense',
        title: expense.description,
        amount: expense.amount,
        date: expense.date,
      }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10)

    return NextResponse.json({
      metrics: {
        currentFunding,
        totalRevenue,
        totalExpenses,
        totalOrders: orders.length,
        pendingOrders,
      },
      revenueByMonth: Array.from(monthlyData.values()),
      expensesByCategory: Array.from(expenseCategories.entries()).map(([category, amount]) => ({
        category,
        amount,
      })),
      recentActivity,
    })
  } catch (error) {
    console.error('Error generating dashboard data:', error)
    return NextResponse.json(
      { 
        metrics: {
          currentFunding: 0,
          totalRevenue: 0,
          totalExpenses: 0,
          totalOrders: 0,
          pendingOrders: 0,
        },
        revenueByMonth: [],
        expensesByCategory: [],
        recentActivity: [],
      },
      { status: 500 }
    )
  }
} 