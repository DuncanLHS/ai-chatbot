"use server"

import type { User } from "@supabase/supabase-js"
import { ChevronUp } from "lucide-react"

// const supabase = await createClient()
// const {
//   data: { user },
//   error,
// } = await supabase.auth.getUser()

export const UserMenuTrigger = async () => {
  const user: User | null = null
  return (
    <>
      {/* <Image
        src={`https://avatar.vercel.sh/${user?.email}`}
        alt={user?.email ?? "User Avatar"}
        width={24}
        height={24}
        className="rounded-full"
      /> */}
      <span data-testid="user-email" className="truncate">
        {/* {user?.is_anonymous ? "Guest" : user?.email} */} test
      </span>

      <ChevronUp className="ml-auto" />
    </>
  )
}
