import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { courseId } = await params

    if (!courseId) {
      return new NextResponse("Course ID is required", { status: 400 })
    }

    const course = await prisma.course.deleteMany({
      where: {
        id: courseId,
        userId: session.user.id,
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    console.log("[COURSE_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
