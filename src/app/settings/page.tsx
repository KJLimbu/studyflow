"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { LogOut, User } from "lucide-react"

export default function SettingsPage() {
  const { data: session } = useSession()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                    Manage your user profile
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium leading-none">{session?.user?.name || "User"}</p>
                        <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                    </div>
                </div>
                <Button variant="destructive" onClick={() => signOut({ callbackUrl: "/login" })}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </CardContent>
        </Card>

        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                    Customize your StudyFlow experience (Coming Soon)
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <Switch id="dark-mode" disabled />
                </div>
                <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="notifications">Notifications</Label>
                    <Switch id="notifications" disabled />
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
