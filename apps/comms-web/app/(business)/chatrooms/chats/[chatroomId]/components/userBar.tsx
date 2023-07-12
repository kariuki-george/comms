"use client"

import React from "react"
import { useChatState } from "@/state/chat.state"
import useStore from "@/state/useStore"

interface Props {
  chatroomId: string
}

const UserBar = ({ chatroomId }: Props) => {
  const state = useStore(useChatState, (state) => state)
  const chatroom = state?.chatrooms[Number(chatroomId)]
  return (
    <div className="flex flex-col ">
      <span className="h-16 border-b p-4 text-lg font-semibold">Details</span>
      <span className="gap-1 p-2">Name: {chatroom?.userName}</span>
      <span className="gap-1 p-2">Email: {chatroom?.userEmail}</span>
      <span className="gap-1 p-2">Country: {chatroom?.location?.country}</span>
    </div>
  )
}

export default UserBar
