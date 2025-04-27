"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const UserButton = async () => {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  const logout = async () => {
    await supabase.auth.signOut()
    return redirect("/")
  }

  return (
    <button
      type="button"
      className="w-full cursor-pointer"
      onClick={() => {
        if (user?.is_anonymous) {
          redirect("/login")
        } else {
          logout()
        }
      }}
    >
      {user?.is_anonymous ? "Login to your account" : "Sign out"}
    </button>
  )
}
