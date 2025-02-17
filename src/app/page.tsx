import Link from "next/link"
import { ArrowRight, CheckCircle2, BarChart3, Package, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/50 backdrop-blur-sm fixed w-full z-10">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
            BusinessTracker
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-purple-600 transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-purple-600 transition-colors" href="#pricing">
            Pricing
          </Link>
          <Link href="/login">
            <Button variant="ghost" className="font-medium hover:text-purple-600 transition-colors">
              Sign In
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="w-full pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-purple-50 via-white to-blue-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-transparent bg-clip-text">
                Manage Your Business <br />with Confidence
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                Track orders, manage expenses, and grow your business with our comprehensive dashboard solution.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/login">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="border-purple-200 hover:bg-purple-50">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group relative overflow-hidden rounded-3xl bg-purple-50 p-8 transition-all hover:shadow-2xl hover:shadow-purple-500/25">
              <div className="space-y-4">
                <div className="inline-block rounded-2xl bg-purple-100 p-3">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold">Order Management</h2>
                <p className="text-gray-600">
                  Track and manage orders efficiently with real-time updates and notifications.
                </p>
              </div>
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-500/10" />
            </div>
            <div className="group relative overflow-hidden rounded-3xl bg-blue-50 p-8 transition-all hover:shadow-2xl hover:shadow-blue-500/25">
              <div className="space-y-4">
                <div className="inline-block rounded-2xl bg-blue-100 p-3">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold">Expense Tracking</h2>
                <p className="text-gray-600">
                  Monitor your expenses and understand where your money is going.
                </p>
              </div>
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10" />
            </div>
            <div className="group relative overflow-hidden rounded-3xl bg-indigo-50 p-8 transition-all hover:shadow-2xl hover:shadow-indigo-500/25">
              <div className="space-y-4">
                <div className="inline-block rounded-2xl bg-indigo-100 p-3">
                  <BarChart3 className="h-6 w-6 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold">Business Analytics</h2>
                <p className="text-gray-600">
                  Make data-driven decisions with comprehensive business analytics.
                </p>
              </div>
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 bg-gradient-to-b from-blue-50 via-white to-purple-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-8 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
                Ready to Transform Your Business?
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-600 md:text-xl">
                Join thousands of businesses already using our platform to grow and succeed.
              </p>
            </div>
            <Link href="/login">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25">
                Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-white border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-4 sm:flex-row items-center">
            <p className="text-sm text-gray-500">
              © 2024 BusinessTracker. All rights reserved.
            </p>
            <nav className="sm:ml-auto flex gap-4 sm:gap-6">
              <Link className="text-sm text-gray-500 hover:text-purple-600 transition-colors" href="#">
                Terms of Service
              </Link>
              <Link className="text-sm text-gray-500 hover:text-purple-600 transition-colors" href="#">
                Privacy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}