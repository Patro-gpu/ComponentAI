import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => request.cookies.getAll(), setAll: (v) => v.forEach(({ name, value }) => request.cookies.set(name, value)) } }
  );
  const { data: { user } } = await supabase.auth.getUser();

  // Protect /dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // Redirect logged-in users away from auth pages
  if ((request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup") && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return response;
}

export const config = { matcher: ["/dashboard/:path*", "/login", "/signup"] };
