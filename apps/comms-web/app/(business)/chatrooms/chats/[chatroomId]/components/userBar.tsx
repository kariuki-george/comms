import React from "react"

import { Button } from "@/components/ui/button"

const UserBar = () => {
  return (
    <div className="flex flex-col ">
      <span className="h-16 border-b p-4 text-lg font-semibold">Details</span>
      <span className="gap-1 p-2">Name: June Chen</span>
      <span className="gap-1 p-2">Email: JuneChen@Gmail.Com</span>
      <span className="gap-1 p-2">Country: Kenya</span>
    </div>
  )
}

export default UserBar
