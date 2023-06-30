import React from "react"

import Agent from "./components/agents"
import AgentForm from "./components/form"

export interface IAgent {
  name: string
  id: number
  email: string
}

const agents: IAgent[] = [
  { id: 1, name: "help", email: "email@email.com" },
  { id: 2, name: "feedback", email: "email@email.com" },
]

const AgentsPage = () => {
  return (
    <div>
      <div className="flex h-full w-full flex-col items-center p-10">
        <h2 className="mb-2 text-xl font-bold">Agents Page</h2>
        <span>Create, update and delete agents</span>
        <div className="flex   w-1/2 flex-col ">
          <div className="my-4 w-full border-b text-lg font-semibold  ">
            Chatbots
          </div>
          <ul className="flex w-full flex-col gap-3">
            {agents.map((agent) => (
              <Agent agent={agent} key={agent.id} />
            ))}
          </ul>
          <div className="mt-10 w-full border-b text-lg font-semibold  ">
            New Agents
          </div>
          <AgentForm />
        </div>
      </div>
    </div>
  )
}

export default AgentsPage
