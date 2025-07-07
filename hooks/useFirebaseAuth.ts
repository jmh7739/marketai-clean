"use client"

import { useState, useEffect } from "react"
import {
  type User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth"
import { auth } from "@/lib/firebase"

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Sign in failed"
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Sign up failed"
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    setError(null)

    try {
      await firebaseSignOut(auth)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Sign out failed"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
  }
}
