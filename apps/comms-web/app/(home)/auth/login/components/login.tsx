"use client"

import { useRouter } from "next/navigation"
import { useAuthStore } from "@/state/auth.state"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useMutation } from "react-query"
import * as z from "zod"

import { siteConfig } from "@/config/site"
import { login } from "@/lib/fetchers"
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

export const LoginForm = () => {
  // Login Functionality
  const router = useRouter()
  const { setAuthToken, setUser } = useAuthStore()
  const { mutate } = useMutation({
    mutationFn: login,
    onSuccess: ({ data }) => {
      setAuthToken(data.authJWT)
      setUser(data.user)
      router.replace(siteConfig.nav.orgs)
      toast({
        title: "Successfully logged in",
        description: `Hi ${data.user.name}, welcome back🎉`,
      })
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values)
  }

  // Define form and validation

  const formSchema = z.object({
    email: z.string().email(),

    password: z.string().min(8),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="] flex w-full max-w-[500px] flex-col gap-3"
      >
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Password</FormLabel>
              <FormControl>
                <Input
                  className="h-12"
                  placeholder="Password"
                  {...field}
                  type="password"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  )
}
