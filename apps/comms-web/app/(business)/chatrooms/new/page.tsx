import React from "react"

import SearchBar from "./components/chats/searchBar"
import UnassignedTable from "./components/chats/unassignedTable"

const UnassignedChats = () => {
  return (
    <div className="flex h-full w-full flex-col gap-4 p-7">
      {/* Search Func */}

      <SearchBar />
      <hr />
      {/* Table */}
      <UnassignedTable />
    </div>
  )
}

export default UnassignedChats
