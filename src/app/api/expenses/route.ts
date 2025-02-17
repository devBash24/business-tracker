import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: {
        date: 'desc'
      }
    })
    
    return NextResponse.json(expenses)
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Handle delete action
    if (body.action === 'delete') {
      await prisma.expense.delete({
        where: { id: body.expenseId }
      })
      return NextResponse.json({ success: true })
    }
    
    // Create new expense
    const { description, amount, category, vendor, date, items, notes } = body

    // Validate required fields
    if (!description || !category || !vendor || !date || !items?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const expense = await prisma.expense.create({
      data: {
        description,
        amount,
        category,
        vendor,
        date: new Date(date),
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice
          }))
        }
      },
      include: {
        items: true
      }
    })

    // Update business metrics
    await updateBusinessMetrics()

    return NextResponse.json(expense)
  } catch (error) {
    console.error('Error processing expense request:', error)
    return NextResponse.json(
      { error: 'Failed to process expense request' },
      { status: 500 }
    )
  }
}

async function updateBusinessMetrics() {
  const expenses = await prisma.expense.aggregate({
    _sum: { amount: true }
  })

  const completedOrders = await prisma.order.findMany({
    where: { isCompleted: true }
  })

  const revenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0)
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