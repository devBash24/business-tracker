'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Clock, Package } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'

interface OrderItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
  totalPrice: number
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
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const orderVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
}

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (!response.ok) throw new Error('Failed to fetch orders')
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleOrderStatus = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/toggle`, {
        method: 'PATCH'
      })
      if (!response.ok) throw new Error('Failed to toggle order status')
      
      await fetchOrders()
    } catch (error) {
      console.error('Error toggling order status:', error)
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'completed') return order.isCompleted
    if (filter === 'pending') return !order.isCompleted
    return true
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Package className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Orders</h2>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
          >
            Pending
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              variants={orderVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              layout
            >
              <Card className={cn(
                "border-l-4",
                order.isCompleted ? "border-l-green-500" : "border-l-yellow-500"
              )}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl">{order.customerName}</CardTitle>
                  <Button
                    onClick={() => toggleOrderStatus(order.id)}
                    variant={order.isCompleted ? "outline" : "default"}
                    className="gap-2"
                  >
                    {order.isCompleted ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4" />
                        Mark Complete
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Delivery Address</p>
                        <p className="text-sm">{order.address}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Delivery Time</p>
                        <p className="text-sm">{new Date(order.deliveryTime).toLocaleString()}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Order Items</p>
                      <div className="space-y-2">
                        {order.orderItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center bg-muted/50 p-2 rounded-md"
                          >
                            <span className="text-sm font-medium">{item.name}</span>
                            <div className="flex gap-4 text-sm">
                              <span>Qty: {item.quantity}</span>
                              <span>${item.unitPrice}/unit</span>
                              <span className="font-medium">${item.totalPrice}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <p className="text-lg font-bold">
                        Total: ${order.totalAmount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
} 