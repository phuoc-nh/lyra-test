"use client"

import * as React from "react"
import { Type, ChevronRight, Hash, ChevronDown, Plus } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/ui/command"

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

export function FieldPopover({ children, onCreateField }: { children: React.ReactNode, onCreateField: (fieldName: string, fieldType: string) => void }) {
  const [open, setOpen] = React.useState(false)
  const [fieldName, setFieldName] = React.useState("")
  const [selectedFieldType, setSelectedFieldType] = React.useState<string | null>(null)

  const handleCreateField = () => {
    if (selectedFieldType) {
      console.log(fieldName, selectedFieldType)
      onCreateField(fieldName || selectedFieldType, selectedFieldType);
      setOpen(false);
      setSelectedFieldType(null)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleCreateField();
    }
  }

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
      <PopoverContent className="w-[500px] p-0" align="start" onKeyDown={handleKeyDown}>
        <div className="space-y-4 p-4">
          <Input
            placeholder="Field name (optional)"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            className="border-primary"

          />
          {!selectedFieldType ? <Command className="rounded-lg border shadow-none">
            <CommandInput placeholder="Find a field type" value={selectedFieldType ?? ""} />
            <CommandList className="max-h-[320px]">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {fieldTypes.map((type) => (
                  <CommandItem
                    key={type.id}
                    className="flex items-center justify-between"
                    onSelect={() => setSelectedFieldType(type.id)}
                  >
                    <div className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" />
                      <span>{type.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command> :
            <>
              <div className="p-2 border border-primary rounded-lg flex items-center gap-2 justify-between cursor-pointer" onClick={() => setSelectedFieldType(null)}>
                {selectedFieldType === 'text' ? <>
                  <div className="flex flex-row items-center gap-2">
                    <Type className="w-3"></Type>
                    <div className="text-sm">Single line text</div>
                  </div>
                  <ChevronDown className="w-3" /></> :
                  <div className="flex flex-row items-center gap-2">
                    <Hash className="w-3"></Hash>
                    <div className="text-sm">Number</div>
                  </div>
                }
              </div>

              <div className="text-sm text-gra">Enter text, or prefill each new cell with a default value.
              </div>

              <div className="space-y-2">
                <label htmlFor="default" className=" font-normal text-xs text-muted-foreground">
                  Default
                </label>
                <Input
                  id="default"
                  placeholder="Enter default value (optional)"
                />
              </div>
            </>
          }
        </div>
        <div className="flex items-center justify-between border-t p-4">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleCreateField} disabled={!selectedFieldType}>
            Create field
          </Button>
        </div>

      </PopoverContent>
    </Popover >
  )
}
