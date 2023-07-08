import React from "react"

import Chatbots from "./components/chatbots"
import ChatbotForm from "./components/form"

const ChatbotsPage = () => {
  return (
    <div>
      <div className="flex h-full w-full flex-col items-center p-10">
        <h2 className="mb-2 text-xl font-bold">Chatbots Page</h2>
        <span>Create, update and delete chatbots</span>
        <div className="flex   w-1/2 flex-col ">
          <div className="my-4 w-full border-b text-lg font-semibold  ">
            Chatbots
          </div>

          <Chatbots />

          <div className="mt-10 w-full border-b text-lg font-semibold  ">
            New Chatbot
          </div>
          <ChatbotForm />
        </div>
      </div>
    </div>
  )
}

export default ChatbotsPage
