import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { assignmentId } = await params

    if (!assignmentId) {
      return new NextResponse("Assignment ID is required", { status: 400 })
    }

    const assignment = await prisma.assignment.deleteMany({
      where: {
        id: assignmentId,
        userId: session.user.id,
      },
    })

    return NextResponse.json(assignment)
  } catch (error) {
    console.log("[ASSIGNMENT_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { assignmentId } = await params
    const body = await req.json()
    const { completed } = body

    if (!assignmentId) {
      return new NextResponse("Assignment ID is required", { status: 400 })
    }

    const existing = await prisma.assignment.findFirst({
      where: {
        id: assignmentId,
        userId: session.user.id,
      },
    })

    if (!existing) {
      return new NextResponse("Assignment not found", { status: 404 })
    }

    const assignment = await prisma.assignment.update({
      where: {
        id: assignmentId,
      },
      data: {
        completed: Boolean(completed),
      },
    })

    return NextResponse.json(assignment)
  } catch (error) {
    console.log("[ASSIGNMENT_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
