import "client-only"
 
import { createBrowserClient, } from "@supabase/ssr"
 
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}


export const signOut =async () => await createClient().auth.signOut()

export const loginWithOAuthProvider = async (provider: 'github' | 'google') =>{
  const supabase = createClient()
  const {data, error} = await supabase.auth.signInWithOAuth({
    provider: provider,
    options:{
      redirectTo: `${window.location.origin}/api/auth/callback`
    }
   })

   
   if(error){
     throw error.message
   }
   return data
}

