"use client"

import React from "react"
import { useChatState } from "@/state/chat.state"
import useStore from "@/state/useStore"

interface Props {
  chatroomId: string
}

const UserBar = ({ chatroomId }: Props) => {
  const state = useStore(useChatState, (state) => state)
  const chatbot = state?.chatrooms[Number(chatroomId)]
  return (
    <div className="flex flex-col ">
      <span className="h-16 border-b p-4 text-lg font-semibold">Details</span>
      <span className="gap-1 p-2">Name: {chatbot?.chatroom.userName}</span>
      <span className="gap-1 p-2">Email: {chatbot?.chatroom.userEmail}</span>
      <span className="gap-1 p-2">
        Country: {chatbot?.chatroom.country.country}
      </span>
    </div>
  )
}

export default UserBar
