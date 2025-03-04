"use client"

import * as React from "react"
import { Type, ChevronRight, Hash, ChevronDown, Plus, HelpCircle, Bell, MoreHorizontal, User, Clock, Trash2, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/ui/command"
import { Switch } from "~/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"

interface FieldType {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const fieldTypes: FieldType[] = [
  {
    id: "number",
    name: "Number",
    icon: Hash,
  },
  {
    id: "text",
    name: "Single line text",
    icon: Type,
  },
]

export function SortPopover({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [fieldName, setFieldName] = React.useState("")
  const [selectedFieldType, setSelectedFieldType] = React.useState<string | null>(null)

  // fetch columns from table to show in the popover
  // React.useEffect(() => {
  //   if (!open) {
  //     setFieldName("")
  //     setSelectedFieldType(null)
  //   }
  // }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-full p-2 border rounded-lg" align="start" >
        <div className="max-w-xl p-4 space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-sm text-gray-600">Sort by</h2>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Select>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="notes">Notes</SelectItem>
                  <SelectItem value="assignee">Assignee</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="asc">
                <SelectTrigger className="w-[140px]">
                  <SelectValue>A → Z</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">A → Z</SelectItem>
                  <SelectItem value="desc">Z → A</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="ghost" size="icon" className="h-9 w-9">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="ghost" className="h-9 px-0 text-gray-600 text-sm p-2">
              <Plus className="h-2 w-2 mr-2" />
              Add another sort
            </Button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Switch />
              <span className="text-sm">Automatically sort records</span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="text-sm">
                Cancel
              </Button>
              <Button size="sm" className="text-sm bg-blue-600 hover:bg-blue-700">Sort</Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover >
  )
}
