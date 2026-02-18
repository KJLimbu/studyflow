import Link from "next/link"
import { RegisterForm } from "@/components/auth/RegisterForm"

export default function RegisterPage() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          StudyFlow
        </div>
        <div className="relative z-20 flex-1 flex items-center justify-center px-4">
          <svg
            viewBox="0 0 500 500"
            className="w-full max-w-[28rem] h-auto"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="softGlow">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Outer decorative ring */}
            <circle cx="250" cy="250" r="230" stroke="white" strokeWidth="0.5" opacity="0.15" />
            <circle cx="250" cy="250" r="215" stroke="white" strokeWidth="0.3" opacity="0.08" strokeDasharray="4 8" />

            {/* Clock — top left */}
            <g filter="url(#glow)">
              <circle cx="145" cy="145" r="60" stroke="white" strokeWidth="2" fill="none" opacity="0.9" />
              <circle cx="145" cy="145" r="52" stroke="white" strokeWidth="0.5" fill="none" opacity="0.3" />
              <circle cx="145" cy="145" r="4" fill="white" opacity="0.9" />
              <line x1="145" y1="145" x2="145" y2="105" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="145" y1="145" x2="175" y2="155" stroke="white" strokeWidth="2" strokeLinecap="round" />
              {/* Clock ticks — all 12 */}
              <line x1="145" y1="89" x2="145" y2="95" stroke="white" strokeWidth="2" />
              <line x1="145" y1="195" x2="145" y2="201" stroke="white" strokeWidth="2" />
              <line x1="89" y1="145" x2="95" y2="145" stroke="white" strokeWidth="2" />
              <line x1="195" y1="145" x2="201" y2="145" stroke="white" strokeWidth="2" />
              <line x1="115" y1="97" x2="118" y2="102" stroke="white" strokeWidth="1" opacity="0.5" />
              <line x1="175" y1="97" x2="172" y2="102" stroke="white" strokeWidth="1" opacity="0.5" />
              <line x1="193" y1="115" x2="188" y2="118" stroke="white" strokeWidth="1" opacity="0.5" />
              <line x1="193" y1="175" x2="188" y2="172" stroke="white" strokeWidth="1" opacity="0.5" />
            </g>

            {/* Checklist — top right */}
            <g filter="url(#glow)">
              <rect x="290" y="95" width="120" height="150" rx="10" stroke="white" strokeWidth="2" fill="none" opacity="0.9" />
              <rect x="295" y="100" width="110" height="14" rx="4" fill="white" opacity="0.08" />
              {/* Row 1 — checked */}
              <rect x="305" y="125" width="20" height="20" rx="4" stroke="white" strokeWidth="1.5" fill="none" opacity="0.8" />
              <polyline points="309,135 314,141 323,129" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="335" y1="135" x2="395" y2="135" stroke="white" strokeWidth="1.5" opacity="0.5" />
              {/* Row 2 — checked */}
              <rect x="305" y="158" width="20" height="20" rx="4" stroke="white" strokeWidth="1.5" fill="none" opacity="0.8" />
              <polyline points="309,168 314,174 323,162" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="335" y1="168" x2="385" y2="168" stroke="white" strokeWidth="1.5" opacity="0.5" />
              {/* Row 3 — unchecked */}
              <rect x="305" y="191" width="20" height="20" rx="4" stroke="white" strokeWidth="1.5" fill="none" opacity="0.35" />
              <line x1="335" y1="201" x2="380" y2="201" stroke="white" strokeWidth="1.5" opacity="0.3" />
            </g>

            {/* Open Book — bottom center */}
            <g filter="url(#glow)">
              <path d="M140 305 Q190 290, 250 310 Q310 290, 360 305 L360 395 Q310 375, 250 395 Q190 375, 140 395 Z" stroke="white" strokeWidth="2" fill="none" opacity="0.9" />
              <path d="M250 310 L250 395" stroke="white" strokeWidth="1.5" opacity="0.7" />
              {/* Left page lines */}
              <line x1="165" y1="325" x2="235" y2="338" stroke="white" strokeWidth="1" opacity="0.35" />
              <line x1="165" y1="340" x2="232" y2="352" stroke="white" strokeWidth="1" opacity="0.35" />
              <line x1="165" y1="355" x2="228" y2="366" stroke="white" strokeWidth="1" opacity="0.35" />
              <line x1="165" y1="370" x2="225" y2="380" stroke="white" strokeWidth="1" opacity="0.25" />
              {/* Right page lines */}
              <line x1="265" y1="338" x2="335" y2="325" stroke="white" strokeWidth="1" opacity="0.35" />
              <line x1="268" y1="352" x2="335" y2="340" stroke="white" strokeWidth="1" opacity="0.35" />
              <line x1="272" y1="366" x2="335" y2="355" stroke="white" strokeWidth="1" opacity="0.35" />
            </g>

            {/* Flow lines connecting all three */}
            <g filter="url(#softGlow)">
              <path d="M200 160 C230 155, 265 135, 295 130" stroke="white" strokeWidth="1.5" strokeDasharray="8 5" opacity="0.4" />
              <path d="M160 200 C175 240, 200 275, 235 305" stroke="white" strokeWidth="1.5" strokeDasharray="8 5" opacity="0.4" />
              <path d="M340 245 C325 270, 295 290, 265 310" stroke="white" strokeWidth="1.5" strokeDasharray="8 5" opacity="0.4" />
            </g>

            {/* Connection dots with glow */}
            <g filter="url(#glow)">
              <circle cx="200" cy="160" r="4" fill="white" opacity="0.7" />
              <circle cx="295" cy="130" r="4" fill="white" opacity="0.7" />
              <circle cx="160" cy="200" r="4" fill="white" opacity="0.7" />
              <circle cx="340" cy="245" r="4" fill="white" opacity="0.7" />
            </g>

            {/* Decorative sparkle dots */}
            <circle cx="80" cy="250" r="2" fill="white" opacity="0.3" />
            <circle cx="420" cy="300" r="1.5" fill="white" opacity="0.25" />
            <circle cx="100" cy="380" r="1.5" fill="white" opacity="0.2" />
            <circle cx="400" cy="90" r="2" fill="white" opacity="0.2" />
            <circle cx="60" cy="120" r="1" fill="white" opacity="0.15" />
            <circle cx="440" cy="200" r="1.5" fill="white" opacity="0.2" />
            <circle cx="250" cy="60" r="1.5" fill="white" opacity="0.2" />
            <circle cx="370" cy="420" r="1" fill="white" opacity="0.15" />
          </svg>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;The best way to predict the future is to create it.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          <RegisterForm />
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign in
            </Link>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

