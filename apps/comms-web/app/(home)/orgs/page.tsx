"use client"

import React from "react"
import Link from "next/link"

interface IOrg {
  name: string
  id: number
}

const orgList: IOrg[] = [
  { id: 1, name: "Pazuka" },
  { id: 2, name: "Imarisha" },
]

const Orgs = () => {
  const handleRouting = (org: IOrg) => {
    console.log(org)
  }
  return (
    <div className="flex h-full w-full justify-center  ">
      <div className="mt-10 flex w-1/2 flex-col rounded-sm border p-3  ">
        <h1 className="border-b pb-2 text-center  text-lg font-semibold">
          Your Orgs
        </h1>
        <ul className="flex flex-col items-center gap-3 py-6 ">
          {orgList.map((org) => (
            <li
              key={org.id}
              className="h-full w-full rounded-sm p-2 text-center hover:cursor-pointer hover:bg-gray-200"
              onClick={() => handleRouting(org)}
            >
              {org.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Orgs
