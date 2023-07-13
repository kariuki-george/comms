import React from "react"

import AuthProvider from "@/lib/providers/auth.provider"

import OrgForm from "./components/createform"
import OrgsList from "./components/orgs"

const Orgs = () => {
  return (
    <AuthProvider>
      <div className="flex h-full w-full justify-center  ">
        <div className="mt-10 flex h-fit  w-1/2 flex-col rounded-sm border p-3  ">
          <h1 className="border-b pb-2 text-center  text-lg font-semibold">
            Your Orgs
          </h1>
          <div>{<OrgsList />}</div>

          <div className="border-t my-5">
            <OrgForm />
          </div>
        </div>
      </div>
    </AuthProvider>
  )
}

export default Orgs
