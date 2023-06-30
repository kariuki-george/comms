import "@/styles/globals.css"
import AllActiveChats from "./components/allchats"

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex h-full   w-full ">
      {/* All active chats */}

      <AllActiveChats />

      {children}
    </div>
  )
}
