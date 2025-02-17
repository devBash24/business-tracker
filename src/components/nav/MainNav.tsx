'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  ShoppingCart, 
  DollarSign, 
  BarChart, 
  Settings 
} from "lucide-react"

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard
  },
  {
    href: "/dashboard/orders",
    label: "Orders",
    icon: ShoppingCart
  },
  {
    href: "/dashboard/expenses",
    label: "Expenses",
    icon: DollarSign
  },
  {
    href: "/dashboard/analytics",
    label: "Analytics",
    icon: BarChart
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings
  }
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 space-y-1 px-4 mt-5">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
              "hover:bg-muted transition-colors",
              pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
} 