export interface IChatbot {
  createdAt: Date
  updatedAt: Date
  id: number
  name: string
  chatbotKey: string
  chatroomIdleTime?: number
  orgId: number
}
