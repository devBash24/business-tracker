import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  try {
    const code = searchParams.get("code");
    // Default to dashboard instead of home
    const next = searchParams.get("next") ?? "/dashboard";

    if (code) {
      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        // Successful authentication
        return NextResponse.redirect(`${origin}${next}`);
      }

      // Authentication error
      console.error("Auth error:", error);
      return NextResponse.redirect(`${origin}/login?error=Authentication failed`);
    }

    // No code provided
    return NextResponse.redirect(`${origin}/login?error=No authentication code`);
  } catch (error) {
    // Unexpected error
    console.error("Callback error:", error);
    return NextResponse.redirect(`${origin}/login?error=Something went wrong`);
  }
}
