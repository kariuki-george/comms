import React from "react"

import { UserForm } from "./userform"

const ChatbotBodyAuth = () => {
  return (
    <div className="flex flex-col gap-3 p-5">
      <span>Please register then you can use the bot</span>
      <UserForm />
    </div>
  )
}

export default ChatbotBodyAuth
