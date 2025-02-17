'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { MainNav } from "./MainNav"
import { UserNav } from "./UserNav"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden fixed inset-x-0 top-0 h-16 border-b bg-background z-50">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600" />
          <h1 className="font-bold">Business Tracker</h1>
        </div>
        <div className="flex items-center gap-2">
          <UserNav />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600" />
                  Business Tracker
                </SheetTitle>
              </SheetHeader>
              <MainNav />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
} 