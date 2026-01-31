import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/database.types";

export async function middleware(request: NextRequest) {
  const res = NextResponse.next({ request });

  // Mode dev : bypasser complètement l'authentification
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
  if (isDevMode) {
    return res;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    return res;
  }

  try {
    const supabase = createServerClient<Database>(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const pathname = request.nextUrl.pathname;

    // Protéger les routes dashboard
    if (pathname.startsWith("/dashboard")) {
      if (!session) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    // Protéger les routes admin
    if (pathname.startsWith("/admin")) {
      if (!session) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // Vérifier le rôle admin
      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (userData?.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    // Rediriger vers dashboard si déjà connecté et sur login/register
    if ((pathname === "/login" || pathname === "/register") && session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return res;
  } catch {
    return res;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
