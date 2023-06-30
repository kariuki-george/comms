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
        "flex h-fit w-fit min-w-[20%] max-w-[75%] flex-col break-words rounded-md p-3 ",
        isSender ? "float-right bg-gray-400 " : "float-left bg-gray-300"
      )}
    >
      <span>{message}</span>
      <span className="mt-1  w-full text-right text-sm text-gray-500">
        {Date().slice(0, 10)}
      </span>
    </div>
  )
}

export default ChatBubble
