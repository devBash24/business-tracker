import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Handle different actions
    if (body.action === 'delete') {
      await prisma.order.delete({
        where: { id: body.orderId }
      })
      return NextResponse.json({ success: true })
    }
    
    if (body.action === 'toggle') {
      const order = await prisma.order.findUnique({
        where: { id: body.orderId }
      })
      
      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        )
      }

      const updatedOrder = await prisma.order.update({
        where: { id: body.orderId },
        data: { isCompleted: !order.isCompleted },
        include: { orderItems: true }
      })

      return NextResponse.json(updatedOrder)
    }
    
    if (body.action === 'update') {
      const updatedOrder = await prisma.order.update({
        where: { id: body.orderId },
        data: body.data,
        include: { orderItems: true }
      })
      return NextResponse.json(updatedOrder)
    }

    // Create new order
    const { customerName, description, address, deliveryTime, orderItems, additionalFees } = body

    // Validate required fields
    if (!customerName || !address || !deliveryTime || !orderItems?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate totals
    const itemsTotal = orderItems.reduce(
      (total: number, item: any) => total + (item.quantity * item.unitPrice),
      0
    )

    const feesTotal = additionalFees.reduce(
      (total: number, fee: any) => total + Number(fee.amount),
      0
    )

    const totalAmount = itemsTotal + feesTotal

    // Create order with items and fees
    const order = await prisma.order.create({
      data: {
        customerName,
        description,
        address,
        deliveryTime,
        totalAmount,
        orderItems: {
          create: orderItems.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice
          }))
        },
        additionalFees: {
          create: additionalFees.map((fee: any) => ({
            name: fee.name,
            amount: Number(fee.amount)
          }))
        }
      },
      include: {
        orderItems: true,
        additionalFees: true
      }
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error processing order request:', error)
    return NextResponse.json(
      { error: 'Failed to process order request' },
      { status: 500 }
    )
  }
} 