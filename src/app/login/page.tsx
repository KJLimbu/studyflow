import Link from "next/link"
import { LoginForm } from "@/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-72px)] flex flex-col lg:grid lg:grid-cols-2 lg:max-w-none">
      
      {/* Left Panel — Warm editorial */}
      <div className="relative hidden h-full flex-col lovable-gradient-hero p-10 lg:flex">
        
        <div className="relative z-10 flex items-center text-xl font-semibold tracking-tight text-foreground">
          StudyFlow.
        </div>
        
        <div className="relative z-10 flex-1 flex flex-col items-start justify-center max-w-lg">
          <h1 className="text-5xl md:text-[3.75rem] font-semibold text-foreground leading-[1.05] tracking-[-1.5px] mb-6">
            Welcome<br />
            back.
          </h1>
          <p className="text-lg text-[#5f5f5d] leading-relaxed">
            Sign in to pick up right where you left off. Your courses, assignments, and priorities are waiting.
          </p>
        </div>
        
        <div className="relative z-10 mt-auto">
          <blockquote className="border-l-2 border-[#eceae4] pl-6">
            <p className="text-lg text-[#5f5f5d] leading-relaxed italic">
              &ldquo;The key is not to prioritize what&apos;s on your schedule, but to schedule your priorities.&rdquo;
            </p>
            <footer className="text-sm text-foreground mt-3 font-medium">
              — Stephen Covey
            </footer>
          </blockquote>
        </div>
      </div>
      
      {/* Right Form Panel */}
      <div className="flex items-center justify-center min-h-[calc(100vh-72px)] p-6 lg:p-8 bg-background">
        <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px] lovable-card p-8">

          <div className="flex flex-col space-y-2 text-left">
            <h1 className="text-[2rem] font-semibold tracking-tight text-foreground leading-tight">
              Sign in
            </h1>
            <p className="text-sm text-[#5f5f5d] leading-relaxed">
              Enter your credentials to access your dashboard.
            </p>
          </div>
          
          <LoginForm />
          
          <div className="border-t border-border pt-6 text-center text-sm text-[#5f5f5d]">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-foreground underline underline-offset-4 hover:opacity-80 transition-opacity font-medium"
            >
              Create one
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}
