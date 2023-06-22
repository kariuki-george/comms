import React, { useState } from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Icons } from "./icons"
import { Badge } from "./ui/badge"

//

const orgList = [{ name: "wow" }, { name: "wow2" }, { name: "wow3" }]

const Sidebar = () => {
  const [active, setActive] = useState(orgList[0].name)
  return (
    <div className="w-[250px] py-5 border-r border-gray-300 justify-between flex flex-col">
      {/* Org selector */}
      <section className="p-2 ">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full  border border-gray-200 rounded-md p-2 hover:border-gray-400 flex justify-center items-center ">
            {active}{" "}
            <span className="ml-3 h-full flex  items-end ">
              {Icons.downArrow}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Orgs</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {orgList.map((org, index) => (
              <DropdownMenuItem key={index} onClick={() => setActive(org.name)}>
                {org.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <hr className="mt-3" />
      </section>

      <section className="h-full">
        <section className="flex flex-col">
          <span className="flex">{Icons.search}Search</span>
          <span>Dashboard</span>
          <span>Mentions</span>
          <span>All</span>
        </section>
        <section className="flex flex-col gap-3 mt-20 h-full font-semibold p-2 ">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg ">CHATS</h2>
            <section className="flex flex-col pl-3 gap-2 font-normal">
              <Link
                href={siteConfig.nav.chats.unassigned}
                className="flex justify-between w-full"
              >
                <span>Unassigned </span>
                <Badge variant={"outline"}>9</Badge>
              </Link>
              <Link
                href={siteConfig.nav.chats.assigned}
                className="flex justify-between w-full"
              >
                <span>Chats </span>
                <Badge variant={"outline"}>3</Badge>
              </Link>
            </section>
          </div>
          <section className="flex flex-col gap-3 mt-20 h-full font-semibold p-2 ">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg ">TEAM</h2>
              <section className="flex flex-col pl-3 gap-2 font-normal">
                <div className="flex justify-between">
                  <span>VIP Inbox </span>
                  <Badge variant={"outline"}>19</Badge>
                </div>{" "}
                <div className="flex justify-between">
                  <span>UK waiting Lee</span>
                  <Badge variant={"outline"}>23</Badge>
                </div>
              </section>
            </div>{" "}
          </section>

          <section className="flex flex-col gap-3 mt-20 h-full font-semibold p-2 ">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg ">TEAMMATES</h2>
              <section className="flex flex-col pl-3 gap-2 font-normal">
                <div className="flex justify-between">
                  <span>Bella Addams </span>
                  <Badge variant={"outline"}>19</Badge>
                </div>{" "}
                <div className="flex justify-between">
                  <span>John Lee</span>
                  <Badge variant={"outline"}>23</Badge>
                </div>
              </section>
            </div>{" "}
          </section>
        </section>
      </section>
      <div>
        <Link href={siteConfig.nav.settings}>
          <h2 className="text-lg ">SETTINGS</h2>
        </Link>
      </div>
      <section className="flex flex-col p-2  ">
        <hr className="mb-10" />
        <span> Log out</span>
      </section>
    </div>
  )
}

export default Sidebar
