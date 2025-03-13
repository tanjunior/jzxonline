import { type NextRequest, NextResponse } from "next/server";
import { auth } from "./server/auth";

// 1. Specify protected and public routes
const protectedRoutes = ["/settings"];
// const publicRoutes = ["/login", "/register", "/"];
const adminRoutes = ["/admin"];

export default auth(async (req: NextRequest) => {
  // // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  // const isPublicRoute = publicRoutes.includes(path);
  const isAdminRoute = adminRoutes.includes(path);

  const session = await auth();
  // console.log("[middleware][session]: ", session);

  if (!session) {
    if (isProtectedRoute || isAdminRoute)
      return NextResponse.redirect(new URL("/login", req.url));
  } else {
    if (isAdminRoute && session.user.role != "admin")
      return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|trpc|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
