"use client"

import React from "react"
import { Copy, Trash } from "lucide-react"

import { useToast } from "@/components/ui/use-toast"

import { IChatbot } from "../page"

interface Props {
  chatbot: IChatbot
}

const Chatbot = ({ chatbot }: Props) => {
  const { toast } = useToast()
  const handleCopy = (chatbotKey: string) => {
    navigator.clipboard.writeText(chatbotKey)
    toast({ description: "Apikey copied to clipboard🙌" })
  }
  return (
    <li className="flex justify-between  flex-col ">
      <span className="font-semibold text-lg">{chatbot.name}</span>
      <div className="flex justify-between">
        <code className="text-gray-700">{chatbot.apikey}</code>{" "}
        <span className="flex  gap-2">
          <Copy
            onClick={() => handleCopy(chatbot.apikey)}
            className="h-5 w-5"
          />
          {<Trash className="h-5 w-5" />}
        </span>
      </div>
    </li>
  )
}

export default Chatbot
