import { Metadata } from "next"
import { NewExpenseForm } from "@/components/expenses/NewExpenseForm"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "New Expense | Business Tracker",
  description: "Add a new expense",
}

export default function NewExpensePage() {
  return (
    <div className="min-h-screen p-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/expenses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">New Expense</h1>
          <p className="text-muted-foreground">
            Add a new business expense
          </p>
        </div>
      </div>

      <NewExpenseForm />
    </div>
  )
} 