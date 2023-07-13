"use client"

import React, { useEffect } from "react"
import { Copy, Trash } from "lucide-react"
import { useMutation } from "react-query"

import { IChatbot } from "@/types/chatbots"
import { deleteChatbot } from "@/lib/fetchers"
import { queryClient } from "@/lib/providers/reactquery.provider"
import { Button } from "@/components/ui/button"
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

  // Handle Delete

  const { mutate, isLoading } = useMutation({
    mutationKey: "chatbots",
    mutationFn: deleteChatbot,
    onSuccess: async () => {
      toast({ description: "Deleted chatbot successfully" })

      queryClient.invalidateQueries("chatbots")
    },
  })

  const handleDelete = () => {
    mutate(chatbot.id)
    toast({ description: "Deleting chatbot" })
  }

  return (
    <li className="flex flex-col  justify-between ">
      <span className="text-lg font-semibold">{chatbot.name}</span>
      <div className="flex justify-between">
        <code className="text-gray-700">{chatbot.chatbotKey}</code>{" "}
        <span className="flex  ">
          <Button
            onClick={() => handleCopy(chatbot.chatbotKey)}
            variant={"ghost"}
          >
            <Copy className="h-5 w-5" />
          </Button>

          <Button
            onClick={handleDelete}
            isLoading={isLoading}
            variant={"ghost"}
          >
            <Trash className="h-5 w-5" />
          </Button>
        </span>
      </div>
    </li>
  )
}

export default Chatbot
