import React from "react"

import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"

const SearchBar = () => {
  return (
    <div className="flex w-full justify-between gap-4">
      <Input placeholder="Search" disabled={true} className="max-w-[700px]" />
      <span className="flex min-w-[150px] items-center justify-around ">
        <span>1-1 of 1</span>
        <span>{Icons.arrowLeft}</span>
        <span>{Icons.arrowRight}</span>
      </span>
    </div>
  )
}

export default SearchBar
