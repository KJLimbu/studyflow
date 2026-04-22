import { withAuth } from "next-auth/middleware"

const middleware = withAuth({
  pages: {
    signIn: "/login",
  },
})

export function proxy(req: any, evt: any) {
  return middleware(req, evt)
}

export const config = {
  matcher: ["/dashboard/:path*", "/assignments/:path*", "/courses/:path*", "/settings/:path*"],
}
