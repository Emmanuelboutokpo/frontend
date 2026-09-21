"use client"

import { useMemo, useState } from "react"
import {
  Check,
  MapPin,
  Navigation,
} from "lucide-react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

import { usePropertyStore } from "@/store"

type DestinationPickerProps = {
  value: string
  onChange: (value: string) => void
  destinations?: string[]
}

export default function DestinationPicker({
  value,
  onChange,
  destinations,
}: DestinationPickerProps) {
  const [open, setOpen] = useState(false)
  const data = usePropertyStore((s) => s.data)

  const popularDestinations = useMemo(() => {
    return data.Communes.slice(0, 5).map((commune) => {
      const dept = data.Departments.find((d) => d.id === commune.department_id)
      const country = data.Countries.find((c) => c.id === dept?.country_id)
      return {
        name: commune.name,
        description: [dept?.name, country?.name].filter(Boolean).join(", "),
      }
    })
  }, [data.Communes, data.Departments, data.Countries])

  const allDestinations = useMemo(() => {
    if (destinations && destinations.length > 0) return destinations
    return Array.from(new Set(data.Communes.map((c) => c.name)))
  }, [destinations, data.Communes])

  const handleSelect = (destination: string) => {
    onChange(destination)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="w-full text-left"
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-emerald-500" />

            <div className="min-w-0 flex-1">
              <p
                className={`truncate text-sm font-semibold ${
                  value
                    ? "text-slate-800"
                    : "text-slate-400"
                }`}
              >
                {value || "Où allez-vous ?"}
              </p>
            </div>
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={10}
        className="w-[min(520px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-[0_20px_50px_rgba(8,26,56,0.18)]"
      >
        <Command className="rounded-2xl">
          <div className="border-b border-slate-100 p-3">
            <CommandInput
              placeholder="Rechercher une ville ou une commune..."
              className="h-11 border-0 text-sm focus:ring-0"
            />
          </div>

          <CommandList className="max-h-[420px] p-2">
            <CommandEmpty>
              Aucune destination trouvée.
            </CommandEmpty>

            {/* Position actuelle */}
            <CommandGroup heading="Près de vous">
              <CommandItem
                value="Ma position actuelle"
                onSelect={() => {
                  onChange("Près de moi")
                  setOpen(false)
                }}
                className="cursor-pointer rounded-xl px-3 py-3"
              >
                <div className="flex w-full items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0a7692]/10">
                    <Navigation className="h-5 w-5 text-emerald-500" />
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">
                      Ma position actuelle
                    </p>

                    <p className="text-xs text-slate-500">
                      Voir les destinations autour de vous
                    </p>
                  </div>
                </div>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator className="my-2" />

            {/* Destinations populaires */}
            <CommandGroup heading="Destinations populaires">
              {popularDestinations.map((destination) => (
                <CommandItem
                  key={destination.name}
                  value={`${destination.name} ${destination.description}`}
                  onSelect={() =>
                    handleSelect(destination.name)
                  }
                  className="cursor-pointer rounded-xl px-3 py-3"
                >
                  <div className="flex w-full items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                      <MapPin className="h-5 w-5 text-emerald-500" />
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">
                        {destination.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {destination.description}
                      </p>
                    </div>

                    {value === destination.name && (
                      <Check className="h-4 w-4 text-emerald-500" />
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator className="my-2" />

            {/* Toutes les destinations */}
            <CommandGroup heading="Toutes les communes">
              {allDestinations
                .filter(
                  (dest) =>
                    !popularDestinations.some(
                      (pop) => pop.name === dest
                    )
                )
                .map((destination) => (
                  <CommandItem
                    key={destination}
                    value={destination}
                    onSelect={() =>
                      handleSelect(destination)
                    }
                    className="cursor-pointer rounded-xl px-3 py-3"
                  >
                    <MapPin className="mr-3 h-4 w-4 text-emerald-500" />

                    <span className="flex-1 font-medium">
                      {destination}
                    </span>

                    {value === destination && (
                      <Check className="h-4 w-4 text-emerald-500" />
                    )}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}