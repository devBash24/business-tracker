import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst()
    
    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        businessName: '',
        businessEmail: '',
        currency: 'XCD',
        businessFunding: 0,
        notificationsEnabled: true,
        emailNotifications: true
      })
    }
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const settings = await prisma.settings.upsert({
      where: {
        id: 1 // Assuming single settings record
      },
      update: {
        businessName: body.businessName,
        businessEmail: body.businessEmail,
        currency: body.currency,
        businessFunding: body.businessFunding,
        notificationsEnabled: body.notificationsEnabled,
        emailNotifications: body.emailNotifications
      },
      create: {
        id: 1,
        ...body
      }
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    )
  }
} 