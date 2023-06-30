import React from "react"

import Chatbot from "./components/chatbot"
import ChatbotForm from "./components/form"

export interface IChatbot {
  name: string
  apikey: string
  id: number
}

const chatbots: IChatbot[] = [
  { apikey: "idcnindivehahaif ", id: 1, name: "help" },
  { apikey: "idcnindiveif ", id: 2, name: "feedback" },
]

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
          <ul className="flex w-full flex-col gap-3">
            {chatbots.map((chatbot) => (
              <Chatbot chatbot={chatbot} key={chatbot.apikey} />
            ))}
          </ul>
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
