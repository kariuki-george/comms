"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { errorParser, getChatbot } from "@/lib/fetchers"
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

export const ChatbotKeyForm = () => {
  // Define form
  // Form validation
  const formSchema = z.object({
    chatbotKey: z.string().uuid("Invalid key"),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chatbotKey: "",
    },
  })

  // Submit

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const chatbot = await getChatbot(values.chatbotKey)
    } catch (error: any) {
      errorParser(error)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" flex w-full max-w-[500px] flex-col gap-3"
      >
        <FormField
          control={form.control}
          name="chatbotKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chatbot Key</FormLabel>
              <FormControl>
                <Input className="h-12" placeholder="Name" {...field} />
              </FormControl>
              <FormDescription>This is the chatbotkey.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <Button className="w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default ChatbotKeyForm
