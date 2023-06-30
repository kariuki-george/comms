"use client"

import React from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"

import { siteConfig } from "@/config/site"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const ChatItem = () => {
  return (
    <li className="border-b  flex items-center h-20 justify-around hover:cursor-pointer hover:bg-gray-100">
      <Button
        variant="ghost"
        className="relative h-8 w-8 rounded-full bg-gray-100  "
      >
        <Avatar className="h-8 w-8  flex items-center">
          <AvatarImage src="/avatars/01.png" alt="@shadcn" />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
      </Button>
      <div className="flex flex-col ">
        <h2 className="font-semibold text-lg">name name</h2>
        <span className="font-light text-sm">
          Lorem ipsum, dolor sit amet c...
        </span>
      </div>
      <Badge className="h-6 w-6 flex items-center  px-2 " variant={"outline"}>
        <span>9</span>
      </Badge>
    </li>
  )
}

const AllActiveChats = () => {
  return (
    <div className="w-1/5  overflow-auto h-full  border-r flex">
      <ul className="w-full h-full flex flex-col  ">
        {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
          <Link href={siteConfig.nav.chats.chats + "/" + index}>
            <ChatItem key={index} />
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
