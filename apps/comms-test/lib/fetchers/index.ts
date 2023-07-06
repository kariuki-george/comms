import axios, { AxiosError, AxiosRequestConfig } from "axios"

import { toast } from "@/components/ui/use-toast"

const API = process.env.NEXT_PUBLIC_API_URL

if (!API) {
  throw new Error("Api Url is not defined")
}

// const query = (url: string, config?: AxiosRequestConfig) => {
//   return axios.get(url, {
//     ...config,
//     headers: { aid: useAuthStore.getState().authToken },
//   })
// }

// To be updated
export const getChatbot = (chatbotId: string) => {
  return axios.post(API)
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
