import Link from "next/link"

import { siteConfig } from "@/config/site"

import { Icons } from "../icons"
import { ThemeToggle } from "../theme-toggle"
import { buttonVariants } from "../ui/button"

const Header = () => {
  return (
    <header className="sticky top-0 z-40 h-30 flex justify-between w-full border-b bg-background py-3 px-10">
      {/* Organisation */}
      <span>
        <Link href="/">
          <span className=" font-bold h-full flex items-center text-lg">
            {siteConfig.name}
          </span>
        </Link>
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
        </nav>
      </div>
    </header>
  )
}

export default Header
