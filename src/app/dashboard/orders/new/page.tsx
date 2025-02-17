import { Metadata } from "next"
import { NewOrderForm } from "@/components/orders/NewOrderForm"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "New Order | Business Tracker",
  description: "Create a new order",
}

export default function NewOrderPage() {
  return (
    <div className="min-h-screen p-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">New Order</h1>
          <p className="text-muted-foreground">
            Create a new customer order
          </p>
        </div>
      </div>

      <NewOrderForm />
    </div>
  )
} 