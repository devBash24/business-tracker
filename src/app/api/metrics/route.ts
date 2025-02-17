import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const metrics = await prisma.businessMetrics.findFirst({
      where: { id: 'default' }
    })

    if (!metrics) {
      return NextResponse.json({
        revenue: 0,
        expenses: 0,
        profit: 0
      })
    }

    return NextResponse.json(metrics)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching business metrics' },
      { status: 500 }
    )
  }
} 