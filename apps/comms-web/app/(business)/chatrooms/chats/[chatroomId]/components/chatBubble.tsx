import React from "react"
import moment from "moment"

import { cn } from "@/lib/utils"

interface Props {
  message: string
  isSender: boolean
  createdAt: Date
}

const ChatBubble = ({ message, isSender, createdAt }: Props) => {
  return (
    <div
      className={cn(
        "flex h-fit w-fit min-w-[20%] max-w-[75%] flex-col break-words rounded-md p-3 ",
        isSender ? "float-right bg-gray-400 " : "float-left bg-gray-300"
      )}
    >
      <span>{message}</span>
      <span className="mt-1  w-full text-right text-sm text-gray-500">
        {moment(createdAt).fromNow()}
      </span>
    </div>
  )
}

export default ChatBubble
