"use client"

import React from "react"

import { IAgent } from "../page"

interface Props {
  agent: IAgent
}

const Agent = ({ agent }: Props) => {
  return (
    <li className="flex flex-col  justify-between ">
      <span className="text-lg font-semibold">{agent.name}</span>
      <div className="flex justify-between">
        <code className="text-gray-700">{agent.email}</code>{" "}
      </div>
    </li>
  )
}

export default Agent
