import React from "react"

import { cn } from "@/lib/utils"

interface Props {
  message: string
  isSender: boolean
}

const ChatBubble = ({ message, isSender }: Props) => {
  return (
    <div
      className={cn(
        "rounded-md min-w-[20%] w-fit p-3 max-w-[75%] h-fit break-words flex flex-col ",
        isSender ? "float-right bg-gray-400 " : "float-left bg-gray-300"
      )}
    >
      <span>{message}</span>
      <span className="w-full  mt-1 text-sm text-right text-gray-500">
        {Date().slice(0, 10)}
      </span>
    </div>
  )
}

export default ChatBubble
