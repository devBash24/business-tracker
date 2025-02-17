import { Metadata } from "next"
import { SettingsForm } from "@/components/settings/SettingsForm"

export const metadata: Metadata = {
  title: "Settings | Business Tracker",
  description: "Manage your business settings",
}

export default function SettingsPage() {
  return (
    <div className="min-h-screen p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your business preferences and settings
        </p>
      </div>

      <SettingsForm />
    </div>
  )
} 