import React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { LoginForm } from "@/components/auth/login"

const Login = () => {
  return (
    <div className="flex h-full justify-center items-center p-2">
      <section className="w-full pt-10  flex flex-col items-center justify-between gap-3">
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
