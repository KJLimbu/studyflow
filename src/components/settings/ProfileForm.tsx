"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Pencil, User, X, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const profileSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

type ProfileValues = z.infer<typeof profileSchema>

export function ProfileForm() {
  const { data: session, update: updateSession } = useSession()
  const [isEditing, setIsEditing] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [feedback, setFeedback] = React.useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
    },
  })

  // Reset form values when session data loads / changes
  React.useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name || "",
        email: session.user.email || "",
      })
    }
  }, [session, form])

  function handleCancel() {
    form.reset({
      name: session?.user?.name || "",
      email: session?.user?.email || "",
    })
    setIsEditing(false)
    setFeedback(null)
  }

  async function onSubmit(values: ProfileValues) {
    setIsLoading(true)
    setFeedback(null)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update profile")
      }

      const updatedUser = await response.json()

      // Update the NextAuth session so the UI reflects the new name/email
      await updateSession({
        user: {
          name: updatedUser.name,
          email: updatedUser.email,
        },
      })

      setFeedback({ type: "success", message: "Profile updated successfully." })
      setIsEditing(false)
    } catch (error: any) {
      setFeedback({
        type: "error",
        message: error.message || "Something went wrong.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account details.</CardDescription>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="gap-1.5"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-[rgba(28,28,28,0.04)] border border-border flex items-center justify-center">
            <User className="h-6 w-6 text-foreground" />
          </div>
          {!isEditing && (
            <div>
              <p className="text-sm font-medium leading-none text-foreground">
                {session?.user?.name || "User"}
              </p>
              <p className="text-sm text-[#5f5f5d] mt-1">
                {session?.user?.email}
              </p>
            </div>
          )}
        </div>

        {/* Feedback banner */}
        {feedback && (
          <div
            className={`text-sm px-3 py-2 rounded-md ${
              feedback.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Edit form */}
        {isEditing ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your name"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        type="email"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="sm"
                  className="gap-1.5"
                >
                  {isLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="gap-1.5"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        ) : null}
      </CardContent>
    </Card>
  )
}
