import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: { isCompleted: !order.isCompleted },
      include: { orderItems: true }
    })

    // Update business metrics when order is completed
    if (updatedOrder.isCompleted) {
      await updateBusinessMetrics()
    }

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Error toggling order status:', error)
    return NextResponse.json(
      { error: 'Failed to toggle order status' },
      { status: 500 }
    )
  }
}

async function updateBusinessMetrics() {
  const completedOrders = await prisma.order.findMany({
    where: { isCompleted: true },
    include: { orderItems: true }
  })

  const revenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0)

  const expenses = await prisma.expense.aggregate({
    _sum: { amount: true }
  })

  const totalExpenses = expenses._sum.amount || 0
  const profit = revenue - totalExpenses

  await prisma.businessMetrics.upsert({
    where: { id: 'default' },
    create: {
      id: 'default',
      revenue,
      expenses: totalExpenses,
      profit
    },
    update: {
      revenue,
      expenses: totalExpenses,
      profit
    }
  })
} 