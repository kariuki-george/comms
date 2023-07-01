"use client"

import React from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"

import { siteConfig } from "@/config/site"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const ChatItem = () => {
  return (
    <li className="flex  h-20 items-center justify-around border-b hover:cursor-pointer hover:bg-gray-100">
      <Button
        variant="ghost"
        className="relative h-8 w-8 rounded-full bg-gray-100  "
      >
        <Avatar className="flex h-8  w-8 items-center">
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
      </Button>
      <div className="flex flex-col ">
        <h2 className="text-lg font-semibold">name name</h2>
        <span className="text-sm font-light">
          Lorem ipsum, dolor sit amet c...
        </span>
      </div>
      <Badge className="flex h-6 w-6 items-center  px-2 " variant={"outline"}>
        <span>9</span>
      </Badge>
    </li>
  )
}

const AllActiveChats = () => {
  return (
    <div className="flex  h-full w-1/5  overflow-auto border-r">
      <ul className="flex h-full w-full flex-col  ">
        {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
          <Link key={index} href={siteConfig.nav.chats.chats + "/" + index}>
            <ChatItem />
          </Link>
        ))}
      </ul>

      {/* <span className="p-2 font-semibold text-lg flex justify-center items-center h-full w-full ">
        no chats
      </span> */}
    </div>
  )
}

export default AllActiveChats
