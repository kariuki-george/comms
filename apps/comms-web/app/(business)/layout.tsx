"use client"

import "@/styles/globals.css"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import Sidebar from "@/components/sidebar"

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
            "bg-background  font-sans   min-h-screen ",
            fontSans.variable
          )}
        >
          <div className=" flex  min-h-screen   ">
            <Sidebar />
            {children}
          </div>
        </body>
      </html>
    </>
  )
}
