import { Metadata } from "next"
import { OrderList } from "@/components/orders/OrderList"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Orders | Business Tracker",
  description: "Manage your business orders",
}

export default function OrdersPage() {
  return (
    <div className="flex min-h-screen flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track your customer orders
          </p>
        </div>
        <Link href="/dashboard/orders/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Order
          </Button>
        </Link>
      </div>

      <OrderList />
    </div>
  )
} 