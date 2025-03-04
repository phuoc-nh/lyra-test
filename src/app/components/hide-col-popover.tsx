"use client"

import * as React from "react"
import { Type, ChevronRight, Hash, ChevronDown, Plus, HelpCircle, Bell, MoreHorizontal, User, Clock } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/ui/command"
import { Switch } from "~/components/ui/switch"

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

export function HideColsPopover({ children }: { children: React.ReactNode }) {
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
      <PopoverContent className="w-[280px] p-2 border rounded-lg" align="start" >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input placeholder="Find a field" className="pr-8" />
              <Button size="icon" variant="ghost" className="absolute right-0 top-0 h-full w-8 hover:bg-transparent">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 py-1.5 hover:bg-muted/50 rounded-md group">
              <div className="flex items-center gap-3">
                <Switch checked={true} />
                {/* <Bell className="h-4 w-4" /> */}
                <span className="text-sm">Notes</span>
              </div>
              <Button size="icon" variant="ghost" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between px-2 py-1.5 hover:bg-muted/50 rounded-md group">
              <div className="flex items-center gap-3">
                <Switch className=" " checked={true} />
                {/* <User className="h-4 w-4" /> */}
                <span className="text-sm">Assignee</span>
              </div>
              <Button size="icon" variant="ghost" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between px-2 py-1.5 hover:bg-muted/50 rounded-md group">
              <div className="flex items-center gap-3">
                <Switch checked={true} />
                {/* <Clock className="h-4 w-4" /> */}
                <span className="text-sm">Status</span>
              </div>
              <Button size="icon" variant="ghost" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button variant="secondary" size="sm" className="w-full bg-muted/60 hover:bg-muted">
              Hide all
            </Button>
            <Button variant="secondary" size="sm" className="w-full bg-muted/60 hover:bg-muted">
              Show all
            </Button>
          </div>
        </div>

      </PopoverContent>
    </Popover >
  )
}
