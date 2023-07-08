import { create } from "zustand"

import "zustand/middleware"
import { createJSONStorage, devtools, persist } from "zustand/middleware"

import { IChatbot } from "@/types/chatbot"
import { IChatroom } from "@/types/chatroom"

interface IState {
  chatbot: IChatbot | null
  setChatbot: (chatbot: IChatbot) => void
  setChatroom: (chatroom: IChatroom) => void
  setAuthToken: (token: string) => void
  chatroom: IChatroom | null
  authToken: string
}

export const useGlobalState = create<IState>()(
  devtools(
    persist(
      (set) => ({
        setChatbot: (chatbot) =>
          set(() => ({ chatbot, authToken: "", chatroom: null })),
        setAuthToken: (authToken) => set(() => ({ authToken })),
        setChatroom: (chatroom) => set(() => ({ chatroom })),
        authToken: "",
        chatbot: null,
        chatroom: null,
      }),
      { name: "global-state", storage: createJSONStorage(() => sessionStorage) }
    )
  )
)
