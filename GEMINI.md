# StudyFlow 🎓 - Project Instructions

This document provides essential context and instructions for working on the StudyFlow project.

## 🚀 Project Overview
StudyFlow is a smart study management application designed to help students prioritize their academic workload using an intelligent scheduling algorithm.

### Core Technologies
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) with React 19.
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type-safe development.
- **ORM**: [Prisma](https://www.prisma.io/) with a **SQLite** database.
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) using the Credentials provider.
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/).
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) for client-side state.
- **Testing**: [Jest](https://jestjs.io/) for unit and integration tests.

### Key Features & Logic
- **Priority Algorithm**: Located in `src/lib/algorithms/priority-scheduler.ts`. It calculates a `priorityScore` based on:
  - **Urgency (40%)**: Proximity to the due date (0-14 days).
  - **Importance (40%)**: Assignment weight (1-10).
  - **Effort (20%)**: Estimated hours (inverted; "quick wins" score higher).
- **Dashboard**: Displays "Today's Focus" based on the highest-ranking priority scores.

## 🛠️ Building and Running

### Setup
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Environment Variables**:
   Ensure a `.env` file exists with:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```
3. **Database Initialization**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### Development
- **Run Dev Server**: `npm run dev` (Access at `http://localhost:3000`)
- **Seed Database**: `npm run prisma:seed` (Populates sample courses/assignments)
- **Linting**: `npm run lint`
- **Testing**: `npm test`

### Production
- **Build**: `npm run build`
- **Start**: `npm start`

## 📂 Project Structure
- `src/app`: Pages, API routes, and layouts (App Router).
- `src/components`: UI components (Shadcn + custom).
- `src/lib/algorithms`: Core business logic for scheduling and prioritization.
- `src/lib/db.ts`: Prisma client singleton.
- `prisma/schema.prisma`: Data models for User, Course, Assignment, and Preferences.
- `src/__tests__`: Test suites for algorithms and components.

## 📝 Development Conventions
- **TypeScript**: Always use strict typing. Avoid `any`.
- **Components**: Prefer Server Components where possible; use `"use client"` only when necessary for interactivity or hooks.
- **Styles**: Use Tailwind CSS 4 utility classes. Follow the established Shadcn UI patterns.
- **Database**: Update `prisma/schema.prisma` for any model changes and run `npx prisma generate`. Use `db push` for local development.
- **Testing**: Write unit tests for new logic in the `src/__tests__` directory using Jest.
- **Commits**: Follow clear, descriptive commit messages.

## 🧠 Strategic Context for Gemini
- When modifying the priority algorithm, ensure consistency with the established weight-based scoring system in `priority-scheduler.ts`.
- When adding new UI components, check `src/components/ui` for existing Shadcn primitives.
- Be mindful of the SQLite limitations (e.g., restricted JSON support) when modifying the Prisma schema.
