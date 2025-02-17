'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { 
  DollarSign, 
  Calendar,
  Tag,
  ArrowUpDown,
  Search
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Expense {
  id: string
  description: string
  amount: number
  date: string
  category: string
}

const EXPENSE_CATEGORIES = [
  'All',
  'Supplies',
  'Equipment',
  'Utilities',
  'Rent',
  'Marketing',
  'Salaries',
  'Transportation',
  'Other'
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
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

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Expense
    direction: 'asc' | 'desc'
  }>({ key: 'date', direction: 'desc' })

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses')
      if (!response.ok) throw new Error('Failed to fetch expenses')
      const data = await response.json()
      setExpenses(data)
    } catch (error) {
      console.error('Error fetching expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (key: keyof Expense) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    })
  }

  const filteredAndSortedExpenses = expenses
    .filter((expense) => {
      const matchesSearch = expense.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesCategory =
        selectedCategory === 'All' || expense.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      const { key, direction } = sortConfig
      const modifier = direction === 'asc' ? 1 : -1
      
      if (key === 'amount') {
        return (a[key] - b[key]) * modifier
      }
      
      return (
        a[key].toString().localeCompare(b[key].toString()) * modifier
      )
    })

  const totalAmount = filteredAndSortedExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <DollarSign className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Expenses Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary mb-4">
            Total: ${totalAmount.toFixed(2)}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-4 px-4 py-2 bg-muted rounded-lg text-sm font-medium">
              <button
                className="flex items-center gap-1"
                onClick={() => handleSort('description')}
              >
                Description
                <ArrowUpDown className="w-4 h-4" />
              </button>
              <button
                className="flex items-center gap-1"
                onClick={() => handleSort('amount')}
              >
                Amount
                <ArrowUpDown className="w-4 h-4" />
              </button>
              <button
                className="flex items-center gap-1"
                onClick={() => handleSort('category')}
              >
                Category
                <ArrowUpDown className="w-4 h-4" />
              </button>
              <button
                className="flex items-center gap-1"
                onClick={() => handleSort('date')}
              >
                Date
                <ArrowUpDown className="w-4 h-4" />
              </button>
              <div></div>
            </div>

            <AnimatePresence mode="popLayout">
              {filteredAndSortedExpenses.map((expense) => (
                <motion.div
                  key={expense.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  layout
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-5 gap-4 items-center">
                        <div className="font-medium">{expense.description}</div>
                        <div className="text-primary font-bold">
                          ${expense.amount.toFixed(2)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          {expense.category}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(expense.date), 'MMM dd, yyyy')}
                        </div>
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {/* Add delete functionality */}}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 