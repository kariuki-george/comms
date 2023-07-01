"use client"

import { useRouter } from "next/navigation"
import { IUser } from "@/state/auth.state"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import { useMutation } from "react-query"
import * as z from "zod"

import { siteConfig } from "@/config/site"
import { errorParser, getStarted } from "@/lib/fetchers"
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
  password: z.string().min(8),
  confirmPassword: z.string().min(8), // Might require extra validation
})

export const RegisterForm = () => {
  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  })

  // Submit
  const router = useRouter()
  const { mutate, isLoading } = useMutation("getStarted", getStarted, {
    onSuccess: (data: any) => {
      toast({
        title: "Account created successfully!",
        description: `Welcome ${data?.name ?? "User"}, let's log you in.`,
      })
      router.push(siteConfig.nav.auth.login)
    },
  })
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.confirmPassword !== values.password) {
      return toast({
        title: "An error occurred",
        description: "Password and confirmPassword should be the same",
        variant: "destructive",
      })
    }
    mutate(values)
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  className="h-12"
                  placeholder="Password"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={isLoading}>
          Submit
        </Button>
      </form>
    </Form>
  )
}
