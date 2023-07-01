import "@/styles/globals.css"
import Header from "@/components/header/header-not-auth"

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex h-full flex-col">
      <Header />
      {children}
    </div>
  )
}
