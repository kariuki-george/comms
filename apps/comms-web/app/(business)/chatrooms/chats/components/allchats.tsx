"use client"

import React from "react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar"
import { useQuery } from "react-query"

import { IChatroom } from "@/types/chatroom"
import { siteConfig } from "@/config/site"
import { getMyChatrooms } from "@/lib/fetchers"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const ChatItem = ({ chatroom }: { chatroom: IChatroom }) => {
  return (
    <li className="flex  h-20 items-center justify-around gap-1 border-b p-1 hover:cursor-pointer hover:bg-gray-100">
      <Button
        variant="ghost"
        className="relative h-8 w-8 rounded-full bg-gray-100  "
      >
        <Avatar className="flex h-8  w-8 items-center">
          <AvatarFallback>{chatroom.location?.country}</AvatarFallback>
        </Avatar>
      </Button>
      <div className="flex w-full  flex-col items-baseline">
        <h2 className="text-lg font-semibold">{chatroom.userName}</h2>
        <span className="text-sm font-light">{chatroom.userEmail}</span>
      </div>
      <Badge className="flex h-6 w-6 items-center  px-2 " variant={"outline"}>
        <span>9</span>
      </Badge>
    </li>
  )
}

const AllActiveChats = () => {
  // fetch all chatrooms
  const { data } = useQuery({
    queryKey: "myChatrooms",
    queryFn: getMyChatrooms,
  })
  return (
    <div className="flex  h-full  w-1/5 min-w-[250px]  overflow-auto border-r">
      {data?.data && data.data.length > 0 ? (
        <ul className="flex h-full w-full flex-col  ">
          {data.data.map((chatroom: IChatroom) => (
            <Link
              key={chatroom.id}
              href={siteConfig.nav.chats.chats + "/" + chatroom.id}
            >
              <ChatItem chatroom={chatroom} />
            </Link>
          ))}
        </ul>
      ) : (
        <span className="flex h-full w-full items-center justify-center p-2 text-lg font-semibold ">
          no chats
        </span>
      )}
    </div>
  )
}

export default AllActiveChats
