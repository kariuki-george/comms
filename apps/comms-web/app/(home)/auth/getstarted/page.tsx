import React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { RegisterForm } from "@/components/auth/register-form"

const GetStarted = () => {
  return (
    <div className="flex h-full justify-center items-center p-2">
      <section className="w-full pt-10  flex flex-col items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Create a completely free account</h1>
        <RegisterForm />
        <span>
          Already have an account?{" "}
          <Link href={siteConfig.nav.auth.login}>
            <Button variant={"link"}>Login</Button>
          </Link>
        </span>
      </section>
    </div>
  )
}

export default GetStarted
