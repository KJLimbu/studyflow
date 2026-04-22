import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { checkAssignmentConflict } from "@/lib/algorithms/conflict-detector"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const assignments = await prisma.assignment.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        dueDate: 'asc'
      },
      include: {
        course: true
      }
    })

    return NextResponse.json(assignments)
  } catch (error) {
    console.log("[ASSIGNMENTS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, dueDate, weight, estimatedHours, courseId, startTime, endTime } = body

    if (!title || !dueDate || weight == null || estimatedHours == null || !startTime || !endTime) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Prepare arrays for conflict detection
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        courses: { include: { sections: true } },
        assignments: true
      }
    })

    if (!user) return new NextResponse("User not found", { status: 404 })

    const sections = user.courses.flatMap(c => c.sections)
    const assignments = user.assignments

    const conflictError = checkAssignmentConflict(
      new Date(dueDate),
      startTime,
      endTime,
      sections,
      assignments
    )

    if (conflictError) {
      return new NextResponse(conflictError, { status: 409 })
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        dueDate: new Date(dueDate),
        weight: parseInt(weight),
        estimatedHours: parseFloat(estimatedHours),
        courseId: courseId || null,
        userId: session.user.id,
        startTime,
        endTime
      }
    })

    return NextResponse.json(assignment)
  } catch (error) {
    console.log("[ASSIGNMENTS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
