"use client"

import React from "react"
import { Copy, Trash } from "lucide-react"

import { IChatbot } from "@/types/chatbots"
import { useToast } from "@/components/ui/use-toast"

interface Props {
  chatbot: IChatbot
}

const Chatbot = ({ chatbot }: Props) => {
  const { toast } = useToast()
  const handleCopy = (chatbotKey: string) => {
    navigator.clipboard.writeText(chatbotKey)
    toast({ description: "ChatbotKey copied to clipboard🙌" })
  }
  return (
    <li className="flex flex-col  justify-between ">
      <span className="text-lg font-semibold">{chatbot.name}</span>
      <div className="flex justify-between">
        <code className="text-gray-700">{chatbot.chatbotKey}</code>{" "}
        <span className="flex  gap-2">
          <Copy
            onClick={() => handleCopy(chatbot.chatbotKey)}
            className="h-5 w-5"
          />
          {<Trash className="h-5 w-5" />}
        </span>
      </div>
    </li>
  )
}

export default Chatbot
