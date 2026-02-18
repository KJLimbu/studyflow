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
    const courses = await prisma.course.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        sections: true
      }
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.log("[COURSES_GET]", error)
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
    const { courseCode, title, color } = body

    if (!courseCode || !title) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const course = await prisma.course.create({
      data: {
        courseCode,
        title,
        color: color || "#3b82f6",
        userId: session.user.id,
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.log("[COURSES_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
