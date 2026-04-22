# StudyFlow Codebase Analysis

Below is a detailed analysis of the StudyFlow project, divided into two sections as provided by specialized analysis agents.

---

## Agent 1: Product Strategy Analyst
### Subject: Problem Statement & Application Purpose

**Overview**
StudyFlow is conceived as a "smart study management application." The core problem it addresses is the overwhelming, disorganized nature of student academic workloads. Students often juggle multiple courses, each with its own assignments, varying levels of importance, and different due dates. As a result, students struggle to prioritize effectively—either focusing on easy tasks while missing major deadlines, or panicking over large projects at the last minute.

**The Solution: Intelligent Prioritization**
StudyFlow solves this problem by moving beyond simple to-do lists. It introduces an **Intelligent Scheduling Algorithm** designed to dynamically rank tasks and guide students on what exactly they need to focus on *today*.

**How It Works:**
The application continuously calculates a `priorityScore` for each assignment based on three specific pillars:
1. **Urgency (40% Weighting):** Analyzes the proximity to the due date (specifically focusing on a 0-14 day window). Assignments due sooner inherently demand more immediate attention.
2. **Importance (40% Weighting):** Evaluates the assignment's weight or grade impact on a scale from 1 to 10. A final project will rank significantly higher than a weekly reading quiz.
3. **Effort (20% Weighting):** Looks at the estimated hours required to complete the task. This operates inversely, rewarding "quick wins." Short, high-impact tasks are bumped up to encourage momentum and prevent procrastination.

By synthesizing these metrics, StudyFlow generates a "Today's Focus" dashboard, fundamentally solving the student's dilemma of "What should I be doing right now?"

---

## Agent 2: UI/UX Design Specialist
### Subject: UI/UX Aesthetic, Typography, and Theming

**Overview**
The UI/UX architecture of StudyFlow is built on top of **React 19** and **Next.js 16**, utilizing **Tailwind CSS 4** and **Shadcn UI**. The design language leans heavily into a modern, clean, and highly legible aesthetic, optimized for a productivity-focused tool where reducing cognitive load is paramount.

**Typography Strategy**
The application relies fundamentally on the **Geist** typeface family provided natively through Next.js Google Fonts optimization.
- **Primary Sans-Serif (`Geist`):** Used universally for headings, body text, and UI element labels. Geist is engineered for screen readability and modern digital interfaces, offering clear, geometric proportions that look professional but approachable. It is mapped to the CSS variable `--font-geist-sans`.
- **Monospace (`Geist Mono`):** Used for any code snippets, technical data, or fixed-width numerical displays. Mapped to `--font-geist-mono`.
- **Global Application:** The `RootLayout` strictly enforces typography by applying `${geistSans.variable} ${geistMono.variable} antialiased` to the `<body>` tag, ensuring crisp font rendering across all browser and OS environments.

**Theming and Color Palette (OKLCH)**
StudyFlow utilizes an advanced, dynamic color system built on **OKLCH (Oklab Color Space)** rather than standard HEX or RGB. This ensures perceptually uniform color transitions between light and dark modes.
- **Light Mode (`:root`):** Features a stark white background (`oklch(1 0 0)`) with highly contrasting extremely dark grey/almost black foreground text (`oklch(0.145 0 0)`). Interactive primary elements use a muted dark tone, creating a monochromatic, academic, and serious aesthetic.
- **Dark Mode (`.dark`):** Completely flips the paradigm, using a deep, restful dark background (`oklch(0.145 0 0)`) and off-white text (`oklch(0.985 0 0)`). This is critical for a study app, as students frequently work late at night and require reduced eye strain.
- **Data Visualization Colors:** Specific OKLCH variables (e.g., `--chart-1` through `--chart-5`) are carved out for visualizing progress, likely used for pie charts or progress bars depicting workload or completion states.

**Component Libraries & Structural Choices**
Using **Shadcn UI** with the `"new-york"` style and a `"neutral"` base color guarantees that the components are tight, compact, and professional. The default `--radius` is set to `0.625rem` (10px), giving cards, inputs, and buttons a friendly, modern rounding without looking overly playful.

**Conclusion**
The typography and aesthetic configuration of StudyFlow perfectly encapsulate a modern productivity tool: stark, extremely readable (Geist font), dark-mode ready (OKLCH color space), and built on robust, accessible primitives (Shadcn UI).
