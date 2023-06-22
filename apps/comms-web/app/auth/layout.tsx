import "@/styles/globals.css"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "bg-background  font-sans antialiased min-h-screen ",
            fontSans.variable
          )}
        >
          <div className="  flex min-h-screen  flex-col ">
            <SiteHeader />
            {children}
          </div>
        </body>
      </html>
    </>
  )
}
