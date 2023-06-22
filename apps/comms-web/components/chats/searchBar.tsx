import React from "react"

import { Icons } from "../icons"
import { Input } from "../ui/input"

const SearchBar = () => {
  return (
    <div className="flex justify-between w-full gap-4">
      <Input placeholder="Search" disabled={true} className="max-w-[700px]" />
      <span className="flex justify-around items-center min-w-[150px] ">
        <span>1-1 of 1</span>
        <span>{Icons.arrowLeft}</span>
        <span>{Icons.arrowRight}</span>
      </span>
    </div>
  )
}

export default SearchBar
