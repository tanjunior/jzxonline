import { NextRequest, NextResponse } from "next/server";
// import { auth } from "./server/auth";
import { getToken } from "next-auth/jwt";
import { env } from "./env";
import NextAuth from "next-auth";
import { authConfig } from "./server/auth/config";

import { cache } from "react";
// 1. Specify protected and public routes
// const protectedRoutes = ["/settings", "/admin"];
// const publicRoutes = ["/login", "/register"];

const { auth: uncachedAuth } = NextAuth(authConfig)

const auth = cache(uncachedAuth);
export default auth(async function middleware(req: NextRequest) {
  // // 2. Check if the current route is protected or public
  // const path = req.nextUrl.pathname;
  // const isProtectedRoute = protectedRoutes.includes(path);
  // const isPublicRoute = publicRoutes.includes(path);

  const session = await auth();
  console.log("[middleware][session]: ", session)
  const token = await getToken({
    req,
    secret: env.AUTH_SECRET,
   });
   console.log("[middleware][token]: ", token)

  // // 4. Redirect to /login if the user is not authenticated
  // if (isProtectedRoute && !session) {
  //   return NextResponse.redirect(new URL("/login", req.nextUrl));
  // }

  // // if (session?.user.role == "admin") return NextResponse.redirect(new URL("/admin", req.nextUrl));

  // // 5. Redirect to /dashboard if the user is authenticated
  // if (
  //   isPublicRoute &&
  //   session?.user &&
  //   !req.nextUrl.pathname.startsWith("/settings")
  // ) {
  //   return NextResponse.redirect(new URL("/", req.nextUrl));
  // }

  return NextResponse.next();
})

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|trpc|_next/static|_next/image|.*\\.png$).*)"],
};
