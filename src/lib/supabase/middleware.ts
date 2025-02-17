import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
export const dynamic = 'force-dynamic'

export async function updateSession(request: NextRequest) {
  // Create a Supabase client with cookies handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value) 
          })
        },
      },
    }
  )

  // Get the current user from Supabase
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Create the response object
  const supabaseResponse = NextResponse.next({ request })

  // If user is not authenticated, redirect to the home page (if not already there)
  if (!user && !request.nextUrl.pathname.startsWith("/login")) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    console.log("redirecting to", url.pathname)

    return NextResponse.redirect(url)
  }

  console.log(request.nextUrl.pathname)
  if (user && !request.nextUrl.pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    
    return NextResponse.redirect(url)
  }


  return supabaseResponse
}
 