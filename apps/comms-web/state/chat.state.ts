import { create } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"

import { IChatroom } from "@/types/chatroom"

interface IState {
  chatrooms: { [key: number]: IChatroom }
  addChatroom: (chatroom: IChatroom) => void
}

function addChatroomHelper(state: IState, chatroom: IChatroom) {
  state.chatrooms[chatroom.id] = chatroom

  return state
}

export const useChatState = create<IState>()(
  persist(
    devtools((set) => ({
      chatrooms: {},
      addChatroom: (chatroom) =>
        set((state) => addChatroomHelper(state, chatroom)),
    })),
    { name: "chat-state", storage: createJSONStorage(() => sessionStorage) }
  )
)
