import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../supabase"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get current session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
  }

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, login, logout, getToken }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}