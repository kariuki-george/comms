"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useMutation } from "react-query"
import * as z from "zod"

import { createOrg } from "@/lib/fetchers"
import { queryClient } from "@/lib/providers/reactquery.provider"
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
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Organization name must be at least 3 characters.",
  }),
})

const OrgForm = () => {
  const { toast } = useToast()
  const { mutate, isLoading } = useMutation({
    mutationFn: createOrg,
    onSuccess: () => {
      toast({ description: "Created organization successfully" })
      queryClient.invalidateQueries("orgs")
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    mutate(values)
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-3 flex w-full gap-2 space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormDescription>This is your org name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button isLoading={isLoading} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  )
}
export default OrgForm
