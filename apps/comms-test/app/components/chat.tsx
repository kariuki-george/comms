"use client"

import React, { MutableRefObject, useEffect, useRef, useState } from "react"
import { useGlobalState } from "@/state/useGlobalState"
import { Socket, io } from "socket.io-client"

import { IMessage } from "@/types/message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ChatBubble from "@/components/chats/chatBubble"

let socket: Socket | null = null

const Chat = () => {
  const { chatroom, authToken } = useGlobalState((state) => state)

  // Socket io

  const [chats, setChats] = useState<IMessage[]>([])
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    socketInitializer()
    return () => {
      socket?.disconnect()
      socket = null
    }
  }, [])

  const socketInitializer = async () => {
    socket = io(process.env.NEXT_PUBLIC_WS_URL as string, {
      extraHeaders: { aid: authToken },
      reconnectionAttempts: 5,
    }).connect()

    socket.on("chats", (msg: IMessage) => {
      setChats((prev) => [...prev, { ...msg, createdAt: new Date() }])
    })

    socket.on("error", (error) => {
      console.log("ERROR", error)
    })
    socket.on("reconnect_failed", () => {
      window.location.reload()
    })
  }

  // Handle send message

  const handleSend = (e: any) => {
    e.preventDefault()

    socket?.emit("chats", { message, chatroomId: chatroom?.id })
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
    <div className="relative flex h-full w-full flex-col  justify-between overflow-hidden">
      {/* Chat's space */}
      <ul className="flex h-full  flex-col  gap-2  overflow-y-auto border-y  p-2">
        {chats.map((message) => (
          <li className="w-full  p-2  " key={message.id}>
            <ChatBubble
              message={message.message}
              createdAt={message.createdAt}
              isSender={message.sender === "USER"}
            />
          </li>
        ))}
        <div ref={bottomRef}></div>
      </ul>

      {/* Input bar */}
      <div className="sticky  bottom-0 p-2       ">
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
