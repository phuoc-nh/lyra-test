"use client"

import * as React from "react"
import { Type, ChevronRight, Hash, ChevronDown, Plus, HelpCircle, Bell, MoreHorizontal, User, Clock, Trash2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/ui/command"
import { Switch } from "~/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import axios from "axios"

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

export function FilterPopover({ children, tableId, viewId }: { children: React.ReactNode, tableId: string, viewId: number }) {
  const [open, setOpen] = React.useState(false)
  const [fieldName, setFieldName] = React.useState("")
  const [selectedFieldType, setSelectedFieldType] = React.useState<string | null>(null)

  const [columns, setColumns] = React.useState<[]>([])

  // React.useEffect(() => {
  //   const fetchTableColumns = async () => {
  //     try {
  //       const response = await axios.get<any>(`/api/tables`, {
  //         params: {
  //           tableId: tableId
  //         }
  //       });

  //       const table = response.data;

  //     } catch (error) {
  //       console.error('Failed to fetch table', error)
  //     }
  //   }
  // }, [])



  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-full p-2 border rounded-lg" align="start" >
        {/* <div className=""> */}
        <div className="text-sm mb-3 text-gray-600">In this view, show records</div>

        <div className="space-y-3">
          {/* First condition row */}
          <div className="grid grid-cols-[80px_200px_200px_1fr_auto_auto]  items-center text-sm">
            <div className="text-gray-600">Where</div>
            <Select>
              <SelectTrigger className="rounded-none">
                <SelectValue placeholder="Name" />
              </SelectTrigger>
              <SelectContent className="">
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="notes">Notes</SelectItem>
                <SelectItem value="assignee">Assignee</SelectItem>
              </SelectContent>
            </Select>
            <Select >
              <SelectTrigger className="rounded-none">
                <SelectValue placeholder="contains" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contains">contains</SelectItem>
                <SelectItem value="does_not_contain">does not contain</SelectItem>
                <SelectItem value="is">is</SelectItem>
                <SelectItem value="is_not">is not</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Enter a value" className="rounded-none" />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Second condition row */}
          {/* <div className="grid grid-cols-[80px_200px_200px_1fr_auto_auto] gap-2 items-center">
            <Select defaultValue="and">
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center gap-2">and</div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="and">and</SelectItem>
                <SelectItem value="or">or</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Name" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="notes">Notes</SelectItem>
                <SelectItem value="assignee">Assignee</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="contains" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contains">contains</SelectItem>
                <SelectItem value="does_not_contain">does not contain</SelectItem>
                <SelectItem value="is">is</SelectItem>
                <SelectItem value="is_not">is not</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Enter a value" />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div> */}
        </div>

        <div className="flex items-center justify-between pt-2 mt-3">
          <div className="flex items-center gap-3">
            <Button variant="link" className="text-blue-600 p-0 h-auto">
              + Add condition
            </Button>
            {/* <div className="flex items-center gap-2">
              <Button variant="link" className="text-gray-600 p-0 h-auto">
                + Add condition group
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div> */}
          </div>
          {/* <Button variant="link" className="text-gray-600 p-0 h-auto">
            Copy from another view
          </Button> */}
        </div>
        {/* </div> */}

      </PopoverContent>
    </Popover >
  )
}
