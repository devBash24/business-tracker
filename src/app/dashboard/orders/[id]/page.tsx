'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { 
  ArrowLeft,
  CheckCircle,
  Clock,
  Package,
  Calendar,
  Receipt
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

interface OrderItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface AdditionalFee {
  id: string
  name: string
  amount: number
}

interface Order {
  id: string
  customerName: string
  description: string | null
  address: string
  deliveryTime: string
  isCompleted: boolean
  totalAmount: number
  orderItems: OrderItem[]
  additionalFees: AdditionalFee[]
  createdAt: string
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch order')
        const data = await response.json()
        setOrder(data)
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }

    getOrder()
  }, [params.id])

  const toggleOrderStatus = async () => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle',
          orderId: params.id
        })
      })
      
      if (!response.ok) throw new Error('Failed to update order status')
      const updatedOrder = await response.json()
      setOrder(updatedOrder)
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const deleteOrder = async () => {
    if (!confirm('Are you sure you want to delete this order?')) return

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          orderId: params.id
        })
      })
      
      if (!response.ok) throw new Error('Failed to delete order')
      router.push('/orders')
    } catch (error) {
      console.error('Error deleting order:', error)
    }
  }

  const calculateSubtotal = () => {
    if (!order) return 0
    return order.orderItems.reduce(
      (total, item) => total + item.totalPrice,
      0
    )
  }

  const calculateAdditionalFees = () => {
    if (!order) return 0
    return order.additionalFees.reduce(
      (total, fee) => total + fee.amount,
      0
    )
  }

  if (loading) {
    return <OrderDetailsSkeleton />
  }

  if (!order) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Order not found</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Order Details</h1>
            <p className="text-muted-foreground">
              Order #{order.id.slice(0, 8)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant={order.isCompleted ? "outline" : "default"}
            onClick={toggleOrderStatus}
          >
            {order.isCompleted ? (
              <>
                <Clock className="w-4 h-4 mr-2" />
                Mark as Pending
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Completed
              </>
            )}
          </Button>
          <Button variant="destructive" onClick={deleteOrder}>
            Delete Order
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-lg font-medium">{order.customerName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <p className="text-lg font-medium">{order.address}</p>
            </div>
            {order.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="text-lg font-medium">{order.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  {format(new Date(order.deliveryTime), 'PPP p')}
                </span>
              </div>
              <Badge variant={order.isCompleted ? "success" : "warning"}>
                {order.isCompleted ? "Completed" : "Pending"}
              </Badge>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Package className="w-4 h-4" />
                Order Items
              </h3>
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${item.unitPrice.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold">${item.totalPrice.toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Receipt className="w-4 h-4" />
                Additional Fees
              </h3>
              {order.additionalFees.map((fee) => (
                <div
                  key={fee.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                >
                  <p className="font-medium">{fee.name}</p>
                  <p className="font-bold">${fee.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Additional Fees</span>
                <span>${calculateAdditionalFees().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total Amount</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.push('/orders')}
        >
          Back to Orders
        </Button>
        <Button
          onClick={() => toggleOrderStatus()}
          disabled={loading}
        >
          Mark as {order.isCompleted ? "Pending" : "Completed"}
        </Button>
      </div>
    </div>
  )
}

function OrderDetailsSkeleton() {
  return (
    <div className="min-h-screen p-8 space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-[120px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[140px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[140px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 