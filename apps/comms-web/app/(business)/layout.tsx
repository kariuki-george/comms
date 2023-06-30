import "@/styles/globals.css"
import Header from "@/components/header/header"

interface RootLayoutProps {
  children: React.ReactNode
}

export default function BusinessLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex h-screen w-full flex-col">
      <Header />
      <div className="h-full overflow-hidden"> {children}</div>
    </div>
  )
}
