"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/app/lib/supabase'

/**
 * Authentication context interface defining the shape of auth state and methods
 * Provides centralized authentication management for the entire application
 */
interface AuthContextType {
  /** Current authenticated user object or null if not logged in */
  user: User | null
  /** Current session object containing auth tokens and metadata */
  session: Session | null
  /** Loading state indicating if auth operations are in progress */
  loading: boolean
  /** Sign in method for existing users */
  signIn: (email: string, password: string) => Promise<{ error: any }>
  /** Sign up method for new users with email verification */
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>
  /** Sign out method to clear user session */
  signOut: () => Promise<void>
  /** Password reset method for forgotten passwords */
  resetPassword: (email: string) => Promise<{ error: any }>
  /** Update user profile information */
  updateProfile: (updates: { name?: string }) => Promise<{ error: any }>
}

// Create the authentication context with undefined as default
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Authentication Provider component that wraps the app with auth context
 * Manages user authentication state, session handling, and auth operations
 * 
 * @param children - React children components to be wrapped with auth context
 * @returns JSX element providing authentication context to children
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // State management for authentication
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    /**
     * Initialize authentication state by checking for existing session
     * This runs once when the component mounts to restore user state
     */
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
        }
        // Update state with current session data
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Session error:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    /**
     * Set up real-time authentication state listener
     * This handles automatic state updates when auth state changes
     * (e.g., user signs in/out, session expires, etc.)
     */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    // Cleanup subscription on component unmount
    return () => subscription.unsubscribe()
  }, [supabase.auth])

  /**
   * Sign in an existing user with email and password
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise resolving to error object if sign in fails
   */
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      console.error('Sign in error:', error)
      return { error: { message: 'An unexpected error occurred' } }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Sign up a new user with email, password, and name
   * Triggers email verification process via Supabase
   * @param email - User's email address
   * @param password - User's chosen password
   * @param name - User's display name
   * @returns Promise resolving to error object if sign up fails
   */
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })
      return { error }
    } catch (error) {
      console.error('Sign up error:', error)
      return { error: { message: 'An unexpected error occurred' } }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Sign out the current user and clear session
   * @returns Promise that resolves when sign out is complete
   */
  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
      }
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Send password reset email to user
   * @param email - Email address to send reset link to
   * @returns Promise resolving to error object if reset fails
   */
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      return { error }
    } catch (error) {
      console.error('Reset password error:', error)
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  /**
   * Update user profile information
   * @param updates - Object containing profile fields to update
   * @returns Promise resolving to error object if update fails
   */
  const updateProfile = async (updates: { name?: string }) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: updates,
      })
      return { error }
    } catch (error) {
      console.error('Update profile error:', error)
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  // Create context value object with all auth methods and state
  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Custom hook to access authentication context
 * Must be used within an AuthProvider component
 * @returns AuthContextType object with user state and auth methods
 * @throws Error if used outside of AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

