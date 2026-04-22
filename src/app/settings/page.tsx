"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { LogOut } from "lucide-react"
import { ProfileForm } from "@/components/settings/ProfileForm"

export default function SettingsPage() {
  const { data: session } = useSession()

  return (
    <div className="flex-1 space-y-8 p-6 md:p-8 pt-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="lovable-heading-page text-foreground">Settings</h2>
          <p className="text-sm text-[#5f5f5d] mt-1">Manage your account and preferences.</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Editable Profile Card */}
        <div className="space-y-4">
          <ProfileForm />

          {/* Sign Out — standalone below profile */}
          <Card>
            <CardContent className="pt-6">
              <Button 
                variant="destructive" 
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="h-10 w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                    Customize your StudyFlow experience.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="notifications" className="text-sm font-medium text-foreground">Notifications</Label>
                      <p className="text-xs text-[#5f5f5d] mt-0.5">Receive reminders for upcoming assignments.</p>
                    </div>
                    <Switch id="notifications" disabled />
                </div>
                <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="compact" className="text-sm font-medium text-foreground">Compact View</Label>
                      <p className="text-xs text-[#5f5f5d] mt-0.5">Use a denser layout for lists.</p>
                    </div>
                    <Switch id="compact" disabled />
                </div>
                <p className="text-xs text-[#5f5f5d] border-t border-border pt-4">
                  More preferences coming soon.
                </p>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}

