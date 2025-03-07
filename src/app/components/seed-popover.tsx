"use client"

import * as React from "react"
import { Type, ChevronRight, Hash, ChevronDown, Plus, HelpCircle, Bell, MoreHorizontal, User, Clock, Trash2, X, Check, Loader2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/ui/command"
import { Switch } from "~/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  rows: z.coerce.number().int().positive().min(1, {
    message: "Rows must be at least 1",
  }),
  columns: z.coerce.number().int().positive().min(1, {
    message: "Columns must be at least 1",
  }),
})
type FormValues = z.infer<typeof formSchema>

export function SeedPopover({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rows: 10,
      columns: 5,
    },
  })

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    setIsSuccess(false)

    try {
      // Simulate API call for seeding data
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Seeding data with:", data)
      // Here you would typically call your actual seeding function
      // await seedDatabase(data.rows, data.columns)

      setIsSuccess(true)
      toast("Data seeded successfully")
    } catch (error) {
      toast("Error seeding data")
    } finally {
      setIsLoading(false)
    }
  }

  function resetDialog() {
    setIsSuccess(false)
    form.reset()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-full p-2 border rounded-lg" align="start" >
        <div>
          <div className="text-lg font-bold">Seed Database</div>
          <div className="text-sm">Enter the number of rows and columns to generate for your database.</div>
        </div>

        <Form  {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="rows"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rows</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter number of rows"
                      {...field}
                      disabled={isLoading || isSuccess}
                    />
                  </FormControl>
                  <FormDescription>Number of data rows to generate</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="columns"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Columns</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter number of columns"
                      {...field}
                      disabled={isLoading || isSuccess}
                    />
                  </FormControl>
                  <FormDescription>Number of data columns to generate</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              {isSuccess ? (
                <Button type="button" onClick={() => setOpen(false)} className="w-full sm:w-auto">
                  <Check className="mr-2 h-4 w-4" />
                  Done
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Seeding...
                    </>
                  ) : (
                    "Seed Data"
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover >
  )
}
