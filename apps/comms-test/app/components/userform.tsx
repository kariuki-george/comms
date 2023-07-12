"use client"

import { useGlobalState } from "@/state/useGlobalState"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { createChatbot, getIp } from "@/lib/fetchers"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

// Form validation
const formSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3),
})

export const UserForm = () => {
  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  })

  //  Submit
  const { chatbot, setAuthToken, setChatroom } = useGlobalState(
    (state) => state
  )

  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Authentication",
      description: "Authenticating and creating your chat session",
    })
    // get ip
    const { ip } = await getIp()

    if (!ip) {
      return
    }

    const data = await createChatbot({
      ...values,
      chatbotId: chatbot?.id,
      ipaddress: ip,
    })
    setChatroom(data.chatroom)
    setAuthToken(data.authToken)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="] flex w-full max-w-[500px] flex-col gap-3"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
              <FormControl>
                <Input className="h-12" placeholder="Name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Email</FormLabel>
              <FormControl>
                <Input className="h-12" placeholder="Email" {...field} />
              </FormControl>
              <FormDescription>This is your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={false}>
          Submit
        </Button>
      </form>
    </Form>
  )
}
