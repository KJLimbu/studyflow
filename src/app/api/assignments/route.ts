import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

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
    const { title, dueDate, weight, estimatedHours, courseId } = body

    if (!title || !dueDate || weight == null || estimatedHours == null) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        dueDate: new Date(dueDate),
        weight: parseInt(weight),
        estimatedHours: parseFloat(estimatedHours),
        courseId: courseId || null,
        userId: session.user.id,
      }
    })

    return NextResponse.json(assignment)
  } catch (error) {
    console.log("[ASSIGNMENTS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
