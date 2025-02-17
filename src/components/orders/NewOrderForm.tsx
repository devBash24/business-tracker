'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface OrderItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
}

interface AdditionalFee {
  name: string
  amount: number
}

interface FormErrors {
  customerName?: string
  address?: string
  deliveryTime?: string
  orderItems?: string
  [key: string]: string | undefined
}

export function NewOrderForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState({
    customerName: '',
    description: '',
    address: '',
    deliveryTime: '',
    orderItems: [
      {
        id: crypto.randomUUID(),
        name: '',
        quantity: 1,
        unitPrice: 0
      }
    ],
    additionalFees: [
      {
        name: 'Delivery Fee',
        amount: 0
      }
    ]
  })

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Delivery address is required'
    }

    if (!formData.deliveryTime) {
      newErrors.deliveryTime = 'Delivery time is required'
    }

    const hasInvalidItems = formData.orderItems.some(
      item => !item.name.trim() || item.quantity < 1 || item.unitPrice < 0
    )

    if (hasInvalidItems) {
      newErrors.orderItems = 'All order items must be valid'
    }

    if (formData.orderItems.length === 0) {
      newErrors.orderItems = 'At least one item is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const addOrderItem = () => {
    setFormData(prev => ({
      ...prev,
      orderItems: [
        ...prev.orderItems,
        {
          id: crypto.randomUUID(),
          name: '',
          quantity: 1,
          unitPrice: 0
        }
      ]
    }))
  }

  const removeOrderItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      orderItems: prev.orderItems.filter(item => item.id !== id)
    }))
  }

  const updateOrderItem = (id: string, field: keyof OrderItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      orderItems: prev.orderItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  }

  const calculateSubtotal = () => {
    return formData.orderItems.reduce(
      (total, item) => total + (item.quantity * item.unitPrice),
      0
    )
  }

  const calculateAdditionalFees = () => {
    return formData.additionalFees.reduce(
      (total, fee) => total + Number(fee.amount),
      0
    )
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateAdditionalFees()
  }

  const updateFee = (index: number, field: keyof AdditionalFee, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      additionalFees: prev.additionalFees.map((fee, i) =>
        i === index ? { ...fee, [field]: value } : fee
      )
    }))
  }

  const addFee = () => {
    setFormData(prev => ({
      ...prev,
      additionalFees: [
        ...prev.additionalFees,
        {
          name: '',
          amount: 0
        }
      ]
    }))
  }

  const removeFee = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalFees: prev.additionalFees.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const formattedData = {
      ...formData,
      deliveryTime: new Date(formData.deliveryTime).toISOString(),
      orderItems: formData.orderItems.map(item => ({
        name: item.name,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
      additionalFees: formData.additionalFees.map(fee => ({
        name: fee.name,
        amount: Number(fee.amount)
      })),
      totalAmount: calculateTotal()
    }

    setLoading(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create order')
      }

      toast({
        title: "Order created",
        description: "The order has been successfully created."
      })

      router.push('/dashboard/orders')
      router.refresh()
    } catch (error) {
      console.error('Error creating order:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create order",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                customerName: e.target.value
              }))}
              className={errors.customerName ? "border-destructive" : ""}
            />
            {errors.customerName && (
              <p className="text-sm text-destructive">{errors.customerName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Delivery Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                address: e.target.value
              }))}
              className={errors.address ? "border-destructive" : ""}
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="deliveryTime">Delivery Time</Label>
              <Input
                id="deliveryTime"
                type="datetime-local"
                value={formData.deliveryTime}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  deliveryTime: e.target.value
                }))}
                className={errors.deliveryTime ? "border-destructive" : ""}
              />
              {errors.deliveryTime && (
                <p className="text-sm text-destructive">{errors.deliveryTime}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Notes (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                description: e.target.value
              }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Order Items</CardTitle>
          <Button type="button" onClick={addOrderItem} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {errors.orderItems && (
            <p className="text-sm text-destructive">{errors.orderItems}</p>
          )}

          <AnimatePresence mode="popLayout">
            {formData.orderItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid gap-4 p-4 border rounded-lg md:grid-cols-[1fr,100px,140px,auto]"
              >
                <div>
                  <Label htmlFor={`item-name-${item.id}`}>Item Name</Label>
                  <Input
                    id={`item-name-${item.id}`}
                    value={item.name}
                    onChange={(e) => updateOrderItem(item.id, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`item-quantity-${item.id}`}>Quantity</Label>
                  <Input
                    id={`item-quantity-${item.id}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateOrderItem(item.id, 'quantity', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor={`item-price-${item.id}`}>Unit Price</Label>
                  <Input
                    id={`item-price-${item.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateOrderItem(item.id, 'unitPrice', parseFloat(e.target.value))}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => removeOrderItem(item.id)}
                    disabled={formData.orderItems.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex justify-end pt-4 border-t">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">
                ${calculateSubtotal().toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Additional Fees</CardTitle>
          <Button type="button" onClick={addFee} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Fee
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence mode="popLayout">
            {formData.additionalFees.map((fee, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid gap-4 p-4 border rounded-lg md:grid-cols-[1fr,140px,auto]"
              >
                <div>
                  <Label htmlFor={`fee-name-${index}`}>Fee Name</Label>
                  <Input
                    id={`fee-name-${index}`}
                    value={fee.name}
                    onChange={(e) => updateFee(index, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`fee-amount-${index}`}>Amount</Label>
                  <Input
                    id={`fee-amount-${index}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={fee.amount}
                    onChange={(e) => updateFee(index, 'amount', e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => removeFee(index)}
                    disabled={index === 0}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Additional Fees</span>
              <span>${calculateAdditionalFees().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/orders')}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Create Order
        </Button>
      </div>
    </form>
  )
} 