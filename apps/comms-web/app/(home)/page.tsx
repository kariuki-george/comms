import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"

export default function IndexPage() {
  return (
    <div className="w-full    ">
      {/* Small Hero section */}

      <div className="  flex h-full w-full flex-col items-center justify-around gap-3  ">
        <h1 className="text-[50px]">
          Message your customers, <br />
          they&apos;ll love you for it
        </h1>

        <section className="flex gap-3">
          <Link href={siteConfig.nav.auth.register}>
            <Button>Sign Up It&apos;s Free</Button>
          </Link>
          <Link href={siteConfig.nav.auth.login}>
            <Button variant={"secondary"}>Welcome Back</Button>
          </Link>
        </section>
      </div>
    </div>
  )
}
