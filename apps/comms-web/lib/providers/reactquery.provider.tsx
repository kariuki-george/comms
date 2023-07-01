"use client"

import React from "react"
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "react-query"

import { errorParser } from "../fetchers"

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const queryCache = new QueryCache({
    onError(err: any) {
      console.log("err", err)
      errorParser(err)
    },
  })

  const mutationCache = new MutationCache({
    onError(err: any) {
      errorParser(err)
    },
  })

  const queryClient = new QueryClient({
    queryCache,
    mutationCache,
  })

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
export default ReactQueryProvider
