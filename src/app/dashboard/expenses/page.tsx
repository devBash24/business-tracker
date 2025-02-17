import { Metadata } from "next"
import { ExpenseList } from "@/components/expenses/ExpenseList"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Expenses | Business Tracker",
  description: "Manage your business expenses",
}

export default function ExpensesPage() {
  return (
    <div className="flex min-h-screen flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">
            Track and manage your business expenses
          </p>
        </div>
        <Link href="/dashboard/expenses/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Expense
          </Button>
        </Link>
      </div>

      <ExpenseList />
    </div>
  )
} 