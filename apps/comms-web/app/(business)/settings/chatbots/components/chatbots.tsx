"use client"

import React from "react"
import { useQuery } from "react-query"

import { IChatbot } from "@/types/chatbots"
import { getChatbots } from "@/lib/fetchers"

import Chatbot from "./chatbot"

const Chatbots = () => {
  // Fetch chatbots

  const { data, isLoading } = useQuery({
    queryFn: getChatbots,
    queryKey: "chatbots",
  })

  return (
    <ul className="flex w-full flex-col gap-3">
      {isLoading && <span>loading</span>}

      {data?.data.map((chatbot: IChatbot) => (
        <Chatbot chatbot={chatbot} key={chatbot.chatbotKey} />
      ))}
    </ul>
  )
}

export default Chatbots
