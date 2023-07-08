import Chat from "./components/chat"
import UserBar from "./components/userBar"

export default function Page({ params }: { params: { chatroomId: string } }) {
  return (
    <div className="flex w-full ">
      {/* Chat space */}
      <div className="w-4/5 border-r ">
        <Chat chatroomId={params.chatroomId} />
      </div>
      {/* User info  */}
      {/* Chatroom: {params.chatroomId} */}
      <div className="w-1/5">
        <UserBar chatroomId={params.chatroomId} />
      </div>
    </div>
  )
}
