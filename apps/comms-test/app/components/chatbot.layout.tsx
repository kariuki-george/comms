"use client"

import React from "react"
import { useGlobalState } from "@/state/useGlobalState"
import useStore from "@/state/useStore"
import { createPortal } from "react-dom"

import ChatbotBodyAuth from "./chatbotBody.auth"
import ChatbotBodyMessage from "./chatbotBody.message"

const ChatbotLayout = () => {
  const state = useStore(useGlobalState, (state) => state)

  return (
    <div className="h-full w-full ">
      {state?.chatbot &&
        createPortal(
          <div className="absolute bottom-10 right-10 flex h-1/2 w-full max-w-[400px] flex-col overflow-hidden rounded-sm border ">
            {/* Header */}
            <header className="flex justify-between border-b p-3 text-lg font-semibold">
              <span> {state?.chatbot.name}</span>
              <span>{state?.chatroom?.userName}</span>
            </header>

            <div className="h-full overflow-auto">
              {state?.authToken ? <ChatbotBodyMessage /> : <ChatbotBodyAuth />}
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

export default ChatbotLayout
