import Header from "@/components/header/header"

import ChatbotKey from "./components/chatbotKey"

export default function IndexPage() {
  return (
    <div className="w-full    ">
      <Header />

      <div className="  flex h-full w-full flex-col items-center justify-around gap-10  ">
        <h1 className="text-[50px]">
          Message your customers, <br />
          they&apos;ll love you for it
        </h1>

        <ChatbotKey />
      </div>
    </div>
  )
}
