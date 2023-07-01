import "@/styles/globals.css"
import AuthProvider from "@/lib/providers/auth.provider"
import OrgProvider from "@/lib/providers/org.provider"
import Header from "@/components/header/header"

interface RootLayoutProps {
  children: React.ReactNode
}

export default function BusinessLayout({ children }: RootLayoutProps) {
  return (
    <AuthProvider>
      <OrgProvider>
        <div className="flex h-screen w-full flex-col">
          <Header />
          <div className="h-full overflow-hidden"> {children}</div>
        </div>
      </OrgProvider>
    </AuthProvider>
  )
}
