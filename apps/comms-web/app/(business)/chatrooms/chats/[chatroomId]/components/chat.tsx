"use client"

import React, { MutableRefObject, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/state/auth.state"
import { useChatState } from "@/state/chat.state"
import { useMutation, useQuery } from "react-query"
import { Socket, io } from "socket.io-client"
import { useStore } from "zustand"

import { IMessage } from "@/types/message"
import { siteConfig } from "@/config/site"
import { closeChatroom, getMessages } from "@/lib/fetchers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ChatBubble from "@/components/chats/chatBubble"

interface Props {
  chatroomId: number
}

let socket: Socket | null = null

const Chat = ({ chatroomId }: Props) => {
  // Chatroom

  const { chatrooms } = useStore(useChatState, (state) => state)
  const authToken = useAuthStore((state) => state.authToken)
  // Messages
  const [messages, setMessages] = useState<IMessage[]>([])

  // Get all messages
  const { refetch } = useQuery({
    queryKey: "chatrooms-messages-" + chatroomId,
    queryFn: () => getMessages(chatroomId),
    onSuccess: ({ data }) => {
      setMessages(data)
    },
    refetchOnWindowFocus: false,
  })

  // Socket io

  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    socketInitializer()
    return () => {
      socket?.disconnect()
      socket = null
    }
  }, [])

  const socketInitializer = () => {
    socket = io(process.env.NEXT_PUBLIC_WS_URL as string, {
      reconnectionAttempts: 5,
      extraHeaders: {
        aid: authToken,
      },
    }).connect()

    console.log(socket)

    socket.on("chats", (msg: IMessage) => {
      msg.createdAt = new Date()
      console.log(msg)
      setMessages((prev) => [...prev, msg])
    })

    socket.on("connect_error", (error: any) => {
      console.log("Connection error:", error)
    })
    socket.on("error", (error) => {
      console.log("ERROR", error)
    })
    socket.on("reconnect_failed", () => {
      window.location.reload()
    })

    socket.on("connect", () => {
      console.log("connected")
    })

    socket.on("reconnect", () => {
      refetch()
    })

    socket.on("disconnect", (reason) => {
      console.log(reason)
    })
  }

  // Handle close chatroom
  const router = useRouter()
  const { mutate, isLoading } = useMutation({
    mutationFn: closeChatroom,
    onSuccess: () => {
      router.replace(siteConfig.nav.chats.chats)
    },
  })
  const handleClose = () => {
    mutate(chatroomId)
  }

  // Handle send message

  const handleSend = (e: any) => {
    e.preventDefault()
    socket?.emit("chats", { message, chatroomId: Number(chatroomId) })
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
  }, [messages])

  return (
    <div className="relative flex h-full w-full flex-col  justify-between overflow-hidden">
      {/* Header */}
      <div className="sticky bottom-0 flex items-center justify-between px-5 py-3 ">
        <span className="text-lg font-semibold">
          {chatrooms[chatroomId]?.userName}
        </span>
        <span>
          <Button
            disabled={isLoading}
            onClick={handleClose}
            variant={"outline"}
          >
            Close
          </Button>
        </span>
      </div>
      {/* Chat's space */}
      <ul className="flex h-full  flex-col  gap-2  overflow-y-auto border-y  p-2">
        {messages.map((message) => (
          <li className="w-full  p-2  " key={message.id}>
            <ChatBubble
              message={message.message}
              isSender={message.sender === "AGENT"}
              createdAt={message.createdAt}
            />
          </li>
        ))}
        <div ref={bottomRef}></div>
      </ul>

      {/* Input bar */}
      <div className="sticky  bottom-0 p-5 pb-10 ">
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
