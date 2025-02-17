import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  try {
    const start = parseISO(searchParams.get('start') || '')
    const end = parseISO(searchParams.get('end') || '')

    // Get all orders and expenses within date range
    const [orders, expenses] = await Promise.all([
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: start,
            lte: end
          }
        },
        include: {
          orderItems: true
        }
      }),
      prisma.expense.findMany({
        where: {
          date: {
            gte: start,
            lte: end
          }
        },
        include: {
          items: true
        }
      })
    ])

    // Calculate totals
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const totalOrders = orders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Calculate revenue and expenses by month
    const revenueByMonth = new Map()
    const expensesByMonth = new Map()

    orders.forEach(order => {
      const monthKey = format(order.createdAt, 'MMM yyyy')
      revenueByMonth.set(
        monthKey,
        (revenueByMonth.get(monthKey) || 0) + order.totalAmount
      )
    })

    expenses.forEach(expense => {
      const monthKey = format(expense.date, 'MMM yyyy')
      expensesByMonth.set(
        monthKey,
        (expensesByMonth.get(monthKey) || 0) + expense.amount
      )
    })

    // Combine revenue and expenses by month
    const revenueByMonthArray = Array.from(revenueByMonth.keys()).map(month => ({
      month,
      revenue: revenueByMonth.get(month) || 0,
      expenses: expensesByMonth.get(month) || 0
    }))

    // Calculate expenses by category
    const expensesByCategory = expenses.reduce((acc, expense) => {
      acc.set(
        expense.category,
        (acc.get(expense.category) || 0) + expense.amount
      )
      return acc
    }, new Map())

    // Get top products by revenue and quantity
    const productStats = new Map()
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        const stats = productStats.get(item.name) || { revenue: 0, quantity: 0 }
        stats.revenue += item.totalPrice
        stats.quantity += item.quantity
        productStats.set(item.name, stats)
      })
    })

    const topProducts = Array.from(productStats.entries())
      .map(([name, stats]) => ({
        name,
        ...stats
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    return NextResponse.json({
      totalRevenue,
      totalExpenses,
      totalOrders,
      averageOrderValue,
      revenueByMonth: revenueByMonthArray,
      expensesByCategory: Array.from(expensesByCategory.entries()).map(([category, amount]) => ({
        category,
        amount
      })),
      topProducts
    })
  } catch (error) {
    console.error('Error generating analytics:', error)
    return NextResponse.json(
      { error: 'Failed to generate analytics' },
      { status: 500 }
    )
  }
} 