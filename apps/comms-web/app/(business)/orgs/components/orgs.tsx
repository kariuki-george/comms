"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { IOrg, useOrgState } from "@/state/org.state"
import { useQuery } from "react-query"

import { siteConfig } from "@/config/site"
import { getOrgs } from "@/lib/fetchers"

const OrgsList = () => {
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
    <ul className="flex flex-col items-center gap-3 my-6 ">
      {isLoading && <span>Fetching orgs</span>}
      {data?.data.map(({ Org }: { Org: IOrg }) => (
        <li
          key={Org.id}
          className="h-full w-full rounded-sm flex gap-10 justify-center items-center group p-2 text-center hover:cursor-pointer hover:bg-gray-200"
          onClick={() => handleRouting(Org)}
        >
          {Org.name}
        </li>
      ))}
    </ul>
  )
}

export default OrgsList
