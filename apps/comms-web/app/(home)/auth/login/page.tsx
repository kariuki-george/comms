import React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { LoginForm } from "@/components/auth/login"

const Login = () => {
  return (
    <div className="flex h-full items-center justify-center p-2">
      <section className="flex w-full  flex-col items-center justify-between gap-3 pt-10">
        <h1 className="text-2xl font-bold">Log in to your comms account</h1>
        <LoginForm />
        <span>
          Don&apos;t have an account?{" "}
          <Link href={siteConfig.nav.auth.register}>
            <Button variant={"link"}>Create free Account</Button>
          </Link>
        </span>
      </section>
    </div>
  )
}

export default Login
