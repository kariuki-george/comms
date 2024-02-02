import Link from "next/link"

import { siteConfig } from "@/config/site"

import { Icons } from "../icons"
import { ThemeToggle } from "../theme-toggle"
import { buttonVariants } from "../ui/button"

const Header = () => {
  return (
    <header className="h-30 bg-background sticky top-0 z-40 flex w-full justify-between border-b px-10 py-3">
      {/* Organisation */}
      <span>
        <Link href="/">
          <span className=" flex h-full items-center text-lg font-bold">
            {siteConfig.name}
          </span>
        </Link>
      </span>

      {/* global routes and profile */}
      <div className="flex items-center justify-end gap-4">
        <nav className="flex items-center space-x-1">
          <Link href={siteConfig.links.status} target="_blank" rel="noreferrer">
            <div
              className={buttonVariants({
                size: "sm",
                variant: "ghost",
              })}
            >
              <span className="">Status</span>
            </div>
          </Link>
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
        </nav>
      </div>
    </header>
  )
}

export default Header
