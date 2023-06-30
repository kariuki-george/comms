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
      <div className="flex items-center flex-col h-full w-full p-10">
        <h2 className="text-xl font-bold mb-2">Chatbots Page</h2>
        <span>Create, update and delete chatbots</span>
        <div className="w-1/2   flex flex-col ">
          <div className="font-semibold text-lg border-b w-full my-4  ">
            Chatbots
          </div>
          <ul className="flex flex-col gap-3 w-full">
            {chatbots.map((chatbot) => (
              <Chatbot chatbot={chatbot} key={chatbot.apikey} />
            ))}
          </ul>
          <div className="font-semibold text-lg border-b w-full mt-10  ">
            New Chatbot
          </div>
          <ChatbotForm />
        </div>
      </div>
    </div>
  )
}

export default ChatbotsPage
