import { create } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"

import { IChatroom } from "@/types/chatroom"
import { IMessage } from "@/types/message"

interface IChatroomState {
  chatroom: IChatroom
  messages: IMessage[]
}

interface IState {
  chatrooms: { [key: number]: IChatroomState }
  addChatroom: (chatroom: IChatroom) => void
  addMessage: (message: IMessage, chatroomId: number) => void
}

function addMessageHelper(state: IState, id: number, message: IMessage) {
  state.chatrooms[id] = {
    chatroom: state.chatrooms[id].chatroom,
    messages: [...state.chatrooms[id].messages, message],
  }
  return state
}

function addChatroomHelper(state: IState, chatroom: IChatroom) {
  state.chatrooms[chatroom.id] = {
    chatroom,
    messages: [],
  }
  return state
}

export const useChatState = create<IState>()(
  persist(
    devtools((set) => ({
      chatrooms: {},
      addChatroom: (chatroom) =>
        set((state) => addChatroomHelper(state, chatroom)),
      addMessage: (message, chatroomId) =>
        set((state) => addMessageHelper(state, chatroomId, message)),
    })),
    { name: "chat-state", storage: createJSONStorage(() => sessionStorage) }
  )
)
