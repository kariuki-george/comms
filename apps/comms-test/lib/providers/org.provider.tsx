"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useOrgState } from "@/state/org.state"

import { siteConfig } from "@/config/site"

interface IProps {
  children: React.ReactNode
}

const OrgProvider = ({ children }: IProps) => {
  const router = useRouter()

  // Check if authToken exists
  const org = useOrgState((state) => state.org)

  useEffect(() => {
    if (!org) {
      router.replace(siteConfig.nav.orgs)
    }
  }, [org])
  return <>{children}</>
}

export default OrgProvider
