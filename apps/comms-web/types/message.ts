export interface IMessage {
  message: string
  chatroomId: string
  sender: "USER" | "AGENT"
  id: number
  sentAt: Date
}
