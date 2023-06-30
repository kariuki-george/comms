"use client"

import React, { MutableRefObject, useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ChatBubble from "@/components/chats/chatBubble"

interface Props {
  chatroomId: string
}

const Chat = ({ chatroomId }: Props) => {
  const [chats, setChats] = useState<string[]>([
    "hi there",
    "I need some help",
    "Hello, Jen. How can I be of help?",
  ])
  const [message, setMessage] = useState<string>("")

  const handleSend = (e: any) => {
    e.preventDefault()

    setChats((prev) => [...prev, message])
    setMessage("")
  }

  // Auto scroll
  const bottomRef = useRef<HTMLDivElement>(
    null
  ) as MutableRefObject<HTMLDivElement>

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
  useEffect(() => {
    scrollToBottom()
  }, [chats])

  return (
    <div className="w-full flex flex-col justify-between h-full  overflow-hidden relative">
      {/* Header */}
      <div className="flex justify-between py-3 px-5 items-center sticky bottom-0 ">
        <span className="font-semibold text-lg">June Chen{chatroomId}</span>
        <span>
          <Button variant={"outline"}>Close</Button>
        </span>
      </div>
      {/* Chat's space */}
      <ul className="flex flex-col  gap-2  h-full  overflow-y-auto border-t  border-b p-2  ">
        {chats.map((val, index) => (
          <li
            className="w-full  p-2  "
            key={val}
            autoFocus={chats.length - 1 == index}
          >
            <ChatBubble
              message={val.toString()}
              isSender={val.length % 2 == 0}
            />
          </li>
        ))}
        <div ref={bottomRef}></div>
      </ul>

      {/* Input bar */}
      <div className="p-5  pb-10 sticky bottom-0 ">
        <form className="flex justify-between  gap-2" onSubmit={handleSend}>
          <Input
            placeholder="Enter message"
            onChange={(e) => {
              setMessage(e.target.value)
            }}
            value={message}
          />
          <Button onClick={handleSend}>Send</Button>
        </form>
      </div>
    </div>
  )
}

export default Chat
