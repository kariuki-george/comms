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
export const getChatbot = async (chatbotKey: string) => {
  try {
    const res = await axios.get(API + "chatbots/" + chatbotKey)

    return res.data
  } catch (error: any) {
    errorParser(error)
  }
}

export const createChatbot = async (data: any) => {
  try {
    const res = await axios.post(API + "chatrooms", data)
    return res.data
  } catch (error: any) {
    errorParser(error)
  }
}

export const getCountry = async () => {
  try {
    const res = await axios.get("http://ip-api.com/json")
    return res.data
  } catch (error: any) {
    errorParser(error)
  }
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
