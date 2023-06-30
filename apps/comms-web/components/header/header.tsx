"use client"

import Link from "next/link"

import { siteConfig } from "@/config/site"

import { Icons } from "../icons"
import { ThemeToggle } from "../theme-toggle"
import { buttonVariants } from "../ui/button"
import AuthenticatedRoutes from "./auth-user-routes"
import { UserNav } from "./user-nav"

const Header = () => {
  return (
    <header className="h-30 sticky top-0 z-40 flex w-full justify-between border-b bg-background px-10 py-3">
      {/* Organisation */}
      <Link href={siteConfig.nav.dashboard}>
        <span className="text-xl font-semibold">comms</span>
      </Link>
      {/* User routes */}
      <span>
        <AuthenticatedRoutes />
      </span>
      {/* global routes and profile */}
      <div className="flex items-center justify-end gap-4">
        <nav className="flex items-center space-x-1">
          <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
            <div
              className={buttonVariants({
                size: "sm",
                variant: "ghost",
              })}
            >
              <Icons.gitHub className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </div>
          </Link>
          <Link
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noreferrer"
          >
            <div
              className={buttonVariants({
                size: "sm",
                variant: "ghost",
              })}
            >
              <Icons.twitter className="h-5 w-5 fill-current" />
              <span className="sr-only">Twitter</span>
            </div>
          </Link>
          <ThemeToggle />
          <span>
            <UserNav />
          </span>
        </nav>
      </div>
    </header>
  )
}

export default Header
