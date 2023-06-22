import React from "react"

import SearchBar from "@/components/chats/searchBar"
import UnassignedTable, {
  ChatRoom,
  columns,
} from "@/components/chats/unassignedTable"

const UnassignedChats = () => {
  const chatrooms: ChatRoom[] = [
    {
      country: "Kenya",
      email: "email@email.com",
      id: 1,
      name: "Kiamni",
      time: "203003030",
    },
    {
      country: "Tanzania",
      email: "email@email.com",
      id: 2,
      name: "Kiamni",
      time: "203003030",
    },
  ]

  return (
    <div className="h-full w-full py-7 px-2 flex flex-col gap-4">
      {/* Search Func */}

      <SearchBar />
      <hr />
      {/* Table */}
      <UnassignedTable data={chatrooms} columns={columns} />
    </div>
  )
}

export default UnassignedChats
