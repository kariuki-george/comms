"use client"

import "@/styles/globals.css"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import Header from "@/components/header/header"

interface RootLayoutProps {
  children: React.ReactNode
}

export default function BusinessLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "bg-background  font-sans flex flex-col  min-h-screen h-screen ",
            fontSans.variable
          )}
        >
          <Header />
          <div className="h-full overflow-hidden"> {children}</div>
        </body>
      </html>
    </>
  )
}
