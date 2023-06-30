import React from "react"

import { Button } from "@/components/ui/button"

const UserBar = () => {
  return (
    <div className="flex flex-col ">
      <span className="p-4 border-b text-lg font-semibold h-16">Details</span>
      <span className="p-2 gap-1">Name: June Chen</span>
      <span className="p-2 gap-1">Email: JuneChen@Gmail.Com</span>
      <span className="p-2 gap-1">Country: Kenya</span>
    </div>
  )
}

export default UserBar
