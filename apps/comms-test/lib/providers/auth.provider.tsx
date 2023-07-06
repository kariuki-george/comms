"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import useStore from "@/state/useStore"

import { siteConfig } from "@/config/site"

import { useAuthStore } from "../../state/auth.state"

interface IProps {
  children: React.ReactNode
}

const AuthProvider = ({ children }: IProps) => {
  const router = useRouter()

  // Check if authToken exists
  const authToken = useAuthStore((state) => state.authToken)

  useEffect(() => {
    if (!authToken) {
      router.push(siteConfig.nav.auth.login)
    }
  }, [authToken])

  return <>{children}</>
}

export default AuthProvider
