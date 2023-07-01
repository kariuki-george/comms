import { useAuthStore } from "@/state/auth.state"
import axios, { AxiosError, AxiosRequestConfig } from "axios"

import { toast } from "@/components/ui/use-toast"

const API = "http://localhost:4000/api/"

const authMutate = (url: string, data: any, config?: AxiosRequestConfig) => {
  return axios
    .post(url, data, {
      ...config,
      headers: { aid: useAuthStore.getState().authToken },
    })
    .then((res) => res.data)
}

const query = (url: string, config?: AxiosRequestConfig) => {
  return axios.get(url, {
    ...config,
    headers: { aid: useAuthStore.getState().authToken },
  })
}

export const getStarted = (user: any) => {
  return axios.post(API + "users", user)
}

export const login = (data: any) => {
  return axios.post(API + "auth/login", data)
}

export const getOrgs = () => {
  return query(API + "orgs")
}

export const errorParser = (error: AxiosError) => {
  if (error.response) {
    const { data } = error.response as any
    if (data?.message) {
      if (typeof data?.message === "string") {
        return toast({
          variant: "destructive",
          title: data.error,
          description: data.message,
        })
      }
      for (const message in data.message) {
        toast({
          variant: "destructive",
          title: data.error,
          description: data.message[message],
        })
      }
    }
  } else {
    toast({
      variant: "destructive",
      title: "An Error Occured",
      description: error.message,
    })
  }
}
