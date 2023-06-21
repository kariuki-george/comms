export class CreateChatroomDto {
  email: string;
  name: string;
  chatbotId: number;
}

export class MessageDto {
  sender: 'AGENT' | 'USER';
  message: string;
}
