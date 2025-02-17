import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ShoppingCart, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface Activity {
  id: string
  type: 'order' | 'expense'
  description: string
  amount: number
  date: string
}

export function RecentActivity({ activities }: { activities: Activity[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50"
            >
              <div className={cn(
                "p-2 rounded-full",
                activity.type === 'order' 
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              )}>
                {activity.type === 'order' ? (
                  <ShoppingCart className="w-4 h-4" />
                ) : (
                  <DollarSign className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.description}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(activity.date).toLocaleDateString()}
                </p>
              </div>
              <p className={cn(
                "text-sm font-medium",
                activity.type === 'order' ? "text-green-600" : "text-red-600"
              )}>
                {activity.type === 'order' ? '+' : '-'}${activity.amount.toFixed(2)}
              </p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 