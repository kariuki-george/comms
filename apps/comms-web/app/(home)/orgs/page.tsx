"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { IOrg, useOrgState } from "@/state/org.state"
import { useQuery } from "react-query"

import { siteConfig } from "@/config/site"
import { getOrgs } from "@/lib/fetchers"
import AuthProvider from "@/lib/providers/auth.provider"

const Orgs = () => {
  // Fetch orgs
  const { data, isLoading } = useQuery({
    queryFn: getOrgs,
    queryKey: ["orgs"],
  })

  // Handle routing
  const { setOrg } = useOrgState()
  const router = useRouter()
  const handleRouting = (org: IOrg) => {
    setOrg(org)
    router.push(siteConfig.nav.dashboard)
  }

  return (
    <AuthProvider>
      <div className="flex h-full w-full justify-center  ">
        <div className="mt-10 flex w-1/2 flex-col rounded-sm border p-3  ">
          <h1 className="border-b pb-2 text-center  text-lg font-semibold">
            Your Orgs
          </h1>
          <ul className="flex flex-col items-center gap-3 py-6 ">
            {isLoading && <span>Fetching orgs</span>}
            {data?.data.map(({ Org }: { Org: IOrg }) => (
              <li
                key={Org.id}
                className="h-full w-full rounded-sm p-2 text-center hover:cursor-pointer hover:bg-gray-200"
                onClick={() => handleRouting(Org)}
              >
                {Org.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AuthProvider>
  )
}

export default Orgs
