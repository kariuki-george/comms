import { set } from "react-hook-form"
import { create } from "zustand"

import { IChatbot } from "@/types/chatbot"

interface IState {
  chatbot: IChatbot | null
  setChatbot: (chatbot: IChatbot) => void
}

export const useChatbotStore = create<IState>((set) => ({
  setChatbot: (chatbot) => set(() => ({ chatbot })),
  chatbot: null,
}))
