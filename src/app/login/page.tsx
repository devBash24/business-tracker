import { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/auth/LoginForm"

export const metadata: Metadata = {
  title: "Login | BusinessTracker",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-white">
        <div className="w-full max-w-[440px] space-y-6">
          <Link href="/" className="inline-block">
            <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
              BusinessTracker
            </span>
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-gray-500">
              Please sign in to access your dashboard
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
      
      {/* Right Side - Decorative */}
      <div className="hidden lg:block lg:flex-1 bg-gradient-to-b from-purple-50 via-blue-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-purple-500/[0.025] bg-[size:40px_40px]" />
        <div className="absolute h-full w-full">
          <div className="absolute right-0 top-1/4 h-56 w-56 rounded-full bg-purple-500/25 blur-3xl" />
          <div className="absolute left-0 top-1/3 h-48 w-48 rounded-full bg-blue-500/25 blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 h-64 w-64 rounded-full bg-indigo-500/25 blur-3xl" />
        </div>
        <div className="relative h-full flex items-center justify-center p-16">
          <div className="space-y-6 max-w-lg text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
              Transform Your Business Management
            </h2>
            <p className="text-gray-600">
              Track orders, manage expenses, and grow your business with our comprehensive dashboard solution.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}