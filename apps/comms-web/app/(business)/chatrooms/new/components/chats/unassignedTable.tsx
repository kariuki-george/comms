"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useChatState } from "@/state/chat.state"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useMutation, useQuery } from "react-query"

import { IChatroom } from "@/types/chatroom"
import { siteConfig } from "@/config/site"
import { getNewChatrooms, joinChatroom } from "@/lib/fetchers"
import { queryClient } from "@/lib/providers/reactquery.provider"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const UnassignedTable = () => {
  // Fetch new chatbots
  const { data } = useQuery({
    queryFn: getNewChatrooms,
    queryKey: "chatrooms",
    refetchInterval: 1000,
  })

  // Handle join
  const { addChatroom } = useChatState((state) => state)
  const router = useRouter()
  const { mutate, isLoading } = useMutation({
    mutationFn: joinChatroom,
    mutationKey: "joinChatroom",
    onSuccess: (data) => {
      addChatroom(data.data)
      router.push(siteConfig.nav.chats.chats + "/" + data.data.id)
      queryClient.invalidateQueries("chatrooms")
    },
  })
  const handleJoin = (chatroomId: number) => {
    mutate(chatroomId)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Country</TableHead>
            <TableHead className="">Join</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data?.length ? (
            data?.data.map((chatroom: IChatroom) => {
              return (
                <TableRow key={chatroom.id}>
                  <TableHead>{chatroom.userName}</TableHead>
                  <TableHead>{chatroom.userEmail}</TableHead>
                  <TableHead>{chatroom.country?.country}</TableHead>
                  <TableHead className="">
                    <Button
                      onClick={() => handleJoin(chatroom.id)}
                      variant={"ghost"}
                      disabled={isLoading}
                    >
                      Join
                    </Button>
                  </TableHead>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default UnassignedTable
