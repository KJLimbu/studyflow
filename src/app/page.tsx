import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Sparkles, BookOpen, Layers, CheckCircle2 } from "lucide-react"
import { LandingAnimations } from "@/components/landing/LandingAnimations"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session?.user?.id) {
    redirect("/dashboard")
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-background relative overflow-hidden">
      
      {/* Hero Section */}
      <section className="w-full pt-32 pb-20 md:pt-48 md:pb-32 px-4 md:px-8 max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
        
        {/* Three.js background + GSAP animations handled client-side */}
        <LandingAnimations />

        <div id="hero-badge" className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-background text-sm text-[#5f5f5d]">
          <Sparkles className="h-4 w-4 text-foreground/70" />
          <span>StudyFlow 1.0 is here</span>
        </div>
        
        {/* Headline — Lovable display sizing */}
        <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-[3.75rem] font-semibold text-foreground leading-[1.05] tracking-[-0.03em] md:tracking-[-1.5px] max-w-4xl mx-auto mb-8">
          Organize your courses.<br />
          <span className="text-[#5f5f5d]">Reclaim your time.</span>
        </h1>
        
        <p id="hero-subtitle" className="text-lg md:text-xl text-[#5f5f5d] lg:max-w-2xl mx-auto mb-12 leading-relaxed">
          StudyFlow is a smart study management application designed to help students prioritize their academic workload using an intelligent scheduling algorithm.
        </p>
        
        <div id="hero-cta" className="flex flex-col sm:flex-row gap-4 items-center">
          <Link 
            href="/register" 
            className="lovable-btn-primary text-base font-normal h-12 inline-flex items-center justify-center min-w-[180px]"
          >
            Start Planning For Free
          </Link>
          <Link 
            href="/login" 
            className="lovable-btn-secondary text-base font-normal h-12 inline-flex items-center justify-center min-w-[160px]"
          >
            Log In
          </Link>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="w-full py-24 px-4 md:px-8 border-t border-border/50 bg-background relative z-10">
        <div className="max-w-6xl mx-auto">
          <div id="features-heading" className="text-center mb-16">
            <h2 className="text-3xl md:text-[3rem] font-semibold leading-tight md:tracking-[-1.2px] text-foreground mb-4">
              Everything you need to succeed.
            </h2>
            <p className="text-[#5f5f5d] text-lg max-w-2xl mx-auto leading-relaxed">
              A carefully crafted toolkit to keep your academic life structured, letting you focus entirely on your studies.
            </p>
          </div>

          <div id="features-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="lovable-card group hover:border-foreground/20 transition-all duration-300 p-8 flex flex-col items-start text-left">
              <div className="h-12 w-12 rounded-full lovable-shadow-inset bg-background border border-border flex items-center justify-center mb-6">
                 <Layers className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="text-xl font-medium tracking-tight mb-3 text-foreground">Smart Priority Algorithm</h3>
              <p className="text-[#5f5f5d] leading-relaxed">
                Tasks are ranked based on urgency (due dates), importance (grade weight), and effort (estimated hours) to surface what needs your attention right now.
              </p>
            </div>

            {/* Card 2 */}
            <div className="lovable-card group hover:border-foreground/20 transition-all duration-300 p-8 flex flex-col items-start text-left">
              <div className="h-12 w-12 rounded-full lovable-shadow-inset bg-background border border-border flex items-center justify-center mb-6">
                 <BookOpen className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="text-xl font-medium tracking-tight mb-3 text-foreground">Course Tracking</h3>
              <p className="text-[#5f5f5d] leading-relaxed">
                Log your syllabus beautifully. Keep track of course credits, associate assignments with their parent node, and monitor total workload accurately.
              </p>
            </div>

            {/* Card 3 */}
            <div className="lovable-card group hover:border-foreground/20 transition-all duration-300 p-8 flex flex-col items-start text-left md:col-span-2 lg:col-span-1">
              <div className="h-12 w-12 rounded-full lovable-shadow-inset bg-background border border-border flex items-center justify-center mb-6">
                 <CheckCircle2 className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="text-xl font-medium tracking-tight mb-3 text-foreground">Conflict Avoidance</h3>
              <p className="text-[#5f5f5d] leading-relaxed">
                Real-time collision detection ensures you aren&apos;t trying to finish assignments during your scheduled course lectures. Stay ahead of your time.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats-section" className="w-full py-24 px-4 bg-background border-t border-border/50">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-12 text-center md:text-left">
           <div>
             <h3 className="text-5xl md:text-[3.75rem] font-semibold text-foreground tracking-tight md:tracking-[-1.2px] mb-2">14<span className="text-[#5f5f5d]/50">d</span></h3>
             <p className="text-[#5f5f5d] font-medium">Algorithm look-ahead window</p>
           </div>
           <div className="w-[1px] h-16 bg-border hidden sm:block" />
           <div>
             <h3 className="text-5xl md:text-[3.75rem] font-semibold text-foreground tracking-tight md:tracking-[-1.2px] mb-2">3<span className="text-[#5f5f5d]/50">x</span></h3>
             <p className="text-[#5f5f5d] font-medium">Priority layers processed</p>
           </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="w-full py-32 px-4 lovable-gradient-footer text-center border-t border-border/50 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl md:text-[3rem] font-semibold leading-tight md:tracking-[-1.2px] text-foreground mb-8">
            Ready to focus?
          </h2>
          <Link 
            href="/register" 
            className="lovable-btn-primary text-lg h-14 px-8 inline-flex items-center justify-center"
          >
            Get started <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Actual Footer */}
      <footer className="w-full py-12 px-6 lg:px-12 bg-background border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-semibold tracking-tight text-foreground text-lg">
          StudyFlow.
        </div>
        <div className="text-sm text-[#5f5f5d]">
          © {new Date().getFullYear()} StudyFlow. Crafted with warmth.
        </div>
        <div className="flex gap-6 text-sm">
          <Link href="/login" className="text-foreground hover:opacity-80 transition-opacity underline underline-offset-4">Log In</Link>
          <Link href="/register" className="text-foreground hover:opacity-80 transition-opacity underline underline-offset-4">Sign Up</Link>
        </div>
      </footer>
    </div>
  )
}
