"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"

import {
  CalendarDays,
  Clock,
  Compass,
  Search,
  Users,
} from "lucide-react"

import { Calendar } from "@/components/ui/calendar"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import DestinationPicker from "./DestinationPicker"
import { usePropertyStore, useSubCategories } from "@/store"
import { tabs } from "@/data/common.data"

type Category =
  | "hebergement"
  | "restaurant"
  | "loisir"

function HeroSearch({destinations,}: { destinations: string[]}) {
  const router = useRouter()
  const data = usePropertyStore((state) => state.data)
  const resetFilters = usePropertyStore((state) => state.resetFilters)
  const setSearchQuery = usePropertyStore((state) => state.setSearchQuery)
  const leisureSubcategories = useSubCategories(3)
  const [category, setCategory] =
  useState<Category>("hebergement")
  const [destination, setDestination] = useState("")

  // Hébergement
  const [arrival, setArrival] = useState<Date>()
  const [departure, setDeparture] = useState<Date>()
  const [guests, setGuests] = useState("")

  // Restaurant
  const [restaurantDate, setRestaurantDate] = useState<Date>()
  const [restaurantTime, setRestaurantTime] = useState("")
  const [restaurantPeople, setRestaurantPeople] = useState("")

  // Loisirs
  const [leisureDate, setLeisureDate] = useState<Date>()
  const [leisureType, setLeisureType] = useState("")
  const [leisurePeople, setLeisurePeople] = useState("")

  const formatDateForUrl = (date?: Date) => {
    if (!date) return ""

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
  }

  const submit = ( event: FormEvent<HTMLFormElement> ) => {
    event.preventDefault()
    const selectedCategory = data.Categories.find((item) => item.slug === category)
    const selectedCommune = data.Communes.find(
      (commune) => commune.name.toLocaleLowerCase() === destination.trim().toLocaleLowerCase()
    )
    const selectedSubcategory =
      category === "loisir" && leisureType !== "all"
        ? leisureSubcategories.find((subcategory) => subcategory.slug === leisureType)
        : undefined
    const guestValue =
      category === "hebergement"
        ? guests
        : category === "restaurant"
          ? restaurantPeople
          : leisurePeople
    const date =
      category === "hebergement"
        ? arrival
        : category === "restaurant"
          ? restaurantDate
          : leisureDate

    resetFilters()
    setSearchQuery({
      categoryId: selectedCategory?.id,
      subcategoryId: selectedSubcategory?.id,
      communeId: selectedCommune?.id,
      checkIn: date ? formatDateForUrl(date) : undefined,
      checkOut: departure ? formatDateForUrl(departure) : undefined,
      guests: Number.parseInt(guestValue, 10) || 0,
    })

    router.push("/explorer")
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto w-full max-w-6xl rounded-2xl bg-white p-2.5 text-black shadow-[0_20px_45px_rgba(8,26,56,0.28)] sm:p-3"
    >
      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-1 pb-2 sm:gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active =
            tab.key === category

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() =>
                setCategory(tab.key)
              }
              className={`relative inline-flex shrink-0 items-center gap-2 px-3 py-2 text-xs font-bold transition sm:px-4 sm:text-sm ${
                active
                  ? "text-emerald-600"
                  : "text-slate-500 hover:hover:text-emerald-700"
              }`}
            >
              <Icon className="h-4 w-4" />

              {tab.label}

              {active && (
                <span className="absolute inset-x-3 -bottom-2 h-0.5 rounded-full bg-emerald-600" />
              )}
            </button>
          )
        })}
      </div>

      {/* ================================================= */}
      {/* HÉBERGEMENT */}
      {/* ================================================= */}

      {category === "hebergement" && (
        <div className="grid gap-2 pt-2 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1fr_auto] lg:items-end">
          <DestinationField
            destination={destination}
            setDestination={setDestination}
            destinations={destinations}
          />

          <DateField
            label="Arrivée"
            date={arrival}
            setDate={setArrival}
            disabled={(date) =>
              date < new Date()
            }
          />

          <DateField
            label="Départ"
            date={departure}
            setDate={setDeparture}
            disabled={(date) =>
              date < (arrival ?? new Date())
            }
          />

          <GuestsField
            label="Voyageurs"
            value={guests}
            onChange={setGuests}
          />

          <SearchButton />
        </div>
      )}

      {/* ================================================= */}
      {/* RESTAURANT */}
      {/* ================================================= */}

      {category === "restaurant" && (
        <div className="grid gap-2 pt-2 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1fr_auto] lg:items-end">
          <DestinationField
            destination={destination}
            setDestination={setDestination}
            destinations={destinations}
          />

          <DateField
            label="Date"
            date={restaurantDate}
            setDate={setRestaurantDate}
            disabled={(date) =>
              date < new Date()
            }
          />

          <label className="block rounded-xl border border-slate-200 px-3 py-2.5 transition focus-within:border-[#0a7692] focus-within:ring-2 focus-within:ring-[#0a7692]/10">
            <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Heure
            </span>

            <span className="mt-1 flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-emerald-500" />

              <Input
                type="time"
                value={restaurantTime}
                onChange={(event) =>
                  setRestaurantTime(
                    event.target.value
                  )
                }
                className="h-auto min-w-0 flex-1 border-0 bg-transparent p-0 text-sm font-semibold shadow-none focus-visible:ring-0"
              />
            </span>
          </label>

          <GuestsField
            label="Personnes"
            value={restaurantPeople}
            onChange={setRestaurantPeople}
          />

          <SearchButton />
        </div>
      )}

      {/* ================================================= */}
      {/* LOISIRS */}
      {/* ================================================= */}

      {category === "loisir" && (
        <div className="grid gap-2 pt-2 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1fr_auto] lg:items-end">
          <DestinationField
            destination={destination}
            setDestination={setDestination}
            destinations={destinations}
          />

          <DateField
            label="Date"
            date={leisureDate}
            setDate={setLeisureDate}
            disabled={(date) =>
              date < new Date()
            }
          />

          <label className="block rounded-xl border border-slate-200 px-3 py-2.5 transition focus-within:border-[#0a7692] focus-within:ring-2 focus-within:ring-[#0a7692]/10">
            <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Activité
            </span>

            <span className="mt-1 flex items-center gap-2">
              <Compass className="h-4 w-4 shrink-0 text-emerald-500" />

              <Select
                value={leisureType}
                onValueChange={setLeisureType}
              >
                <SelectTrigger className="h-auto min-w-0 flex-1 border-0 bg-transparent p-0 text-sm font-semibold shadow-none focus:ring-0">
                  <SelectValue placeholder="Toutes les activités" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">
                    Toutes les activités
                  </SelectItem>
                  {leisureSubcategories.map((sc) => (
                    <SelectItem key={sc.id} value={sc.slug}>
                      {sc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </span>
          </label>

          <GuestsField
            label="Participants"
            value={leisurePeople}
            onChange={setLeisurePeople}
          />

          <SearchButton />
        </div>
      )}
    </form>
  )
}

/* ========================================================= */
/* DESTINATION FIELD */
/* ========================================================= */

function DestinationField({
  destination,
  setDestination,
  destinations,
}: {
  destination: string
  setDestination: (value: string) => void
  destinations: string[]
}) {
  return (
    <label className="block rounded-xl border border-slate-200 px-3 py-2.5 transition">
      <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">
        Destination
      </span>

      <span className="mt-1 flex items-center gap-2">
        <DestinationPicker
          value={destination}
          onChange={setDestination}
          destinations={destinations}
        />
      </span>
    </label>
  )
}

/* ========================================================= */
/* DATE FIELD */
/* ========================================================= */

function DateField({
  label,
  date,
  setDate,
  disabled,
}: {
  label: string
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
}) {
  return (
    <label className="block rounded-xl border border-slate-200 px-3 py-2.5 transition focus-within:border-[#0a7692] focus-within:ring-2 focus-within:ring-[#0a7692]/10">
      <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </span>

      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="mt-1 flex w-full items-center gap-2 bg-transparent text-left text-sm font-semibold outline-none"
          >
            <CalendarDays className="h-4 w-4 shrink-0 text-emerald-500" />

            <span
              className={
                !date
                  ? "text-slate-400"
                  : ""
              }
            >
              {date
                ? date.toLocaleDateString(
                    "fr-FR",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )
                : "Choisir une date"}
            </span>
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-0"
          align="start"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>
    </label>
  )
}

/* ========================================================= */
/* GUESTS FIELD */
/* ========================================================= */

function GuestsField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block rounded-xl border border-slate-200 px-3 py-2 transition ">
      <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </span>

      <span className="flex items-center gap-2">
        <Users className="h-4 w-4 shrink-0 text-emerald-500" />

        <Select
          value={value}
          onValueChange={onChange}
        >
          <SelectTrigger className="h-auto min-w-0 flex-1 border-0 bg-transparent p-0 text-sm font-semibold shadow-none focus:ring-0">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="1">
              1 personne
            </SelectItem>

            <SelectItem value="2">
              2 personnes
            </SelectItem>

            <SelectItem value="3">
              3 personnes
            </SelectItem>

            <SelectItem value="4">
              4 personnes
            </SelectItem>

            <SelectItem value="5">
              5 personnes
            </SelectItem>

            <SelectItem value="6">
              6+ personnes
            </SelectItem>
          </SelectContent>
        </Select>
      </span>
    </label>
  )
}

/* ========================================================= */
/* SEARCH BUTTON */
/* ========================================================= */

function SearchButton() {
  return (
    <button
      type="submit"
      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-[#0a3d71] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f6ad2e] focus-visible:ring-offset-2"
    >
      <Search className="h-4 w-4" />
      Rechercher
    </button>
  )
}

export default HeroSearch
