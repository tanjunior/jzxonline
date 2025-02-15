import { NextRequest, NextResponse } from "next/server";
import { auth } from "./server/auth";

// 1. Specify protected and public routes
const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/register", "/talents", "/about"];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const session = await auth();

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 5. Redirect to /dashboard if the user is authenticated
  if (
    // isPublicRoute &&
    // session?.user &&
    // !req.nextUrl.pathname.startsWith("/dashboard")
    isPublicRoute &&
    session?.user
  ) {
    if (session.user.role == "admin") return NextResponse.redirect(new URL("/admin", req.nextUrl));
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|trpc|_next/static|_next/image|.*\\.png$).*)"],
};
