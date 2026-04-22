# StudyFlow Technical Documentation

This document provides a deep dive into the technical architecture, data models, and core algorithms of the StudyFlow project.

## Architecture Overview

StudyFlow follows a modern full-stack architecture using the **Next.js 16 App Router**.

- **Frontend**: React 19 components styled with Tailwind CSS 4 and Shadcn UI.
- **Backend**: Next.js API Routes (Route Handlers) serving as a lightweight backend layer.
- **Database**: SQLite database managed through the Prisma ORM.
- **Authentication**: NextAuth.js with Credentials provider (Email/Password).
- **State Management**: Zustand for client-side state (e.g., UI preferences, global task state).

### Project Structure
- `src/app`: Contains the application pages and API routes.
- `src/components`: Reusable UI components (Shadcn UI + custom logic).
- `src/lib`: Core business logic, database client, and utility functions.
- `src/lib/algorithms`: Contains the `priority-scheduler.ts` – the "brain" of StudyFlow.
- `prisma/`: Database schema and migration files.

## Data Model (Prisma Schema)

The database consists of five main entities:

1.  **User**: Stores user profile information and authentication details.
2.  **Course**: Represents an academic course (e.g., "Intro to Computer Science"). Courses can have multiple assignments and schedule sections.
3.  **Assignment**: The core unit of work. Contains details like due date, weight (importance), and estimated hours (effort).
4.  **Section**: Represents a course's weekly schedule (e.g., "Mon/Wed 9:00 - 10:15 in Room 302").
5.  **UserPreference**: Stores user-specific settings for the scheduling algorithm (e.g., preferred study hours).

### Relationships
- A `User` has many `Assignments` and `Courses`.
- A `Course` has many `Assignments` and `Sections`.

## Priority Algorithm: `priority-scheduler.ts`

The heart of StudyFlow is its intelligent prioritization logic. It calculates a `priorityScore` for each assignment based on three weighted factors:

### 1. Urgency (Weight: 0.4)
- **Calculation**: Based on the number of days until the `dueDate`.
- **Logic**: Tasks due today or overdue receive a score of 10. Tasks due in 14+ days receive a score of 1. Between 0-14 days, the score is calculated via linear interpolation.

### 2. Importance (Weight: 0.4)
- **Calculation**: Directly mapped from the assignment's `weight` (1-10).
- **Logic**: Higher weight assignments (e.g., a final exam vs. a weekly quiz) contribute more to the priority score.

### 3. Effort (Weight: 0.2)
- **Calculation**: Inverted scale based on `estimatedHours`.
- **Logic**: "Quick wins" are prioritized. A task estimated at 1 hour or less gets a score of 10, while a task estimated at 10+ hours gets a score of 1.

### Final Score Formula
```
Priority Score = (Urgency × 0.4) + (Importance × 0.4) + (Effort × 0.2)
```

## Detailed Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16** | Application Framework (App Router, Server Components) |
| **Prisma** | ORM (Type-safe database access) |
| **SQLite** | Local Database (Zero-config, serverless) |
| **NextAuth.js** | Authentication & Session Management |
| **Tailwind CSS 4** | Utilty-first Styling |
| **Shadcn UI** | High-quality Accessible UI Components |
| **Zustand** | Lightweight Client State Management |
| **Zod** | Schema Validation (Forms & API request bodies) |
| **Lucide React** | Icon Suite |
| **Recharts** | Data Visualization (Dashboard stats) |

## Development and Testing

- **Testing**: Jest and React Testing Library are configured for unit testing (see `src/__tests__`).
- **Seeding**: Run `npm run prisma:seed` to populate the local database with sample courses and assignments for development.
- **Linting**: ESLint is configured to maintain code quality.
