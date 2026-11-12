import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("gm_access_token")?.value;
    const role = request.cookies.get("gm_role")?.value;

    const isLoginPage = pathname === "/login";

    const isStudentRoute = pathname.startsWith("/student");
    const isTeacherRoute = pathname.startsWith("/teacher");
    const isAdminRoute = pathname.startsWith("/admin");
    const isProtectedRoute = isStudentRoute || isTeacherRoute || isAdminRoute;

    if (isLoginPage && token && role) {
        if (role === "Student") {
            return NextResponse.redirect(new URL("/student/dashboard", request.url));
        }
        if (role === "Teacher") {
            return NextResponse.redirect(new URL("/teacher/dashboard", request.url));
        }
        if (role === "Admin") {
            return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        }
    }

    if (isProtectedRoute && !token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isStudentRoute && role !== "Student") {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isTeacherRoute && role !== "Teacher" && role !== "Admin") {
        return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }

    if (isAdminRoute && role !== "Admin") {
        return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/student/:path*",
        "/teacher/:path*",
        "/admin/:path*",
        "/login",
        "/register/:path*",
        "/forgot-password",
        "/reset-password",
    ],
};
