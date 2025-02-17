import { createClient } from "@/lib/supabase/server"



export const getUserServerSession = async () => {
    const supabase = createClient()
    if(!supabase){
        throw new Error("Supabase not initialized")
    }

    const {error, data} = await supabase.auth.getUser()
    if(error){
        throw error
    
    }
    const user = data.user
    return{
        id: user?.id
    }

}