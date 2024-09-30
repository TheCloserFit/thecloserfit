import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req })

    const isMarketingPage = req.nextUrl.pathname === "/"
    if (isMarketingPage) {
      return null
    }

    const isAuth = !!token
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/register") ||
      req.nextUrl.pathname.startsWith("/privacy") ||
      req.nextUrl.pathname.startsWith("/terms") ||
      req.nextUrl.pathname.startsWith("/cookies")

    if (isAuthPage) {
      if (isAuth) {
        const from = req.nextUrl.searchParams.get("from")
        if (from) {
          return NextResponse.redirect(new URL(from, req.url))
        }
        return NextResponse.redirect(new URL("/interviews", req.url))
      }

      return null
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }

      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      )
    }
  },
  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true
      },
    },
  }
)
