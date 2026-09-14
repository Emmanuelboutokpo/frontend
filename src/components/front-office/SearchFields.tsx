import type { Dispatch, RefObject, SetStateAction } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  CalendarDays,
  MapPin,
  Minus,
  Plus,
  Search,
  Users,
} from 'lucide-react'

type SearchMode = 'desktop' | 'mobile'

type GuestSetter = Dispatch<SetStateAction<number>>

type SearchFieldsProps = {
  mode: SearchMode
  destination: string
  onDestinationChange: (value: string) => void
  date: Date | undefined
  onDateChange: (date: Date | undefined) => void
  calendarOpen: boolean
  onCalendarOpenChange: (open: boolean) => void
  guestsOpen: boolean
  onGuestsOpenChange: (open: boolean) => void
  adults: number
  children: number
  pets: number
  setAdults: GuestSetter
  setChildren: GuestSetter
  setPets: GuestSetter
  onUpdateGuests: (setter: GuestSetter, value: number, minimum: number) => void
  calendarRef: RefObject<HTMLDivElement | null>
  guestsRef: RefObject<HTMLDivElement | null>
}

type CalendarFieldProps = Pick<
  SearchFieldsProps,
  'mode' | 'date' | 'onDateChange' | 'calendarOpen' | 'onCalendarOpenChange' | 'guestsOpen' | 'onGuestsOpenChange' | 'calendarRef'
>

type GuestsFieldProps = Pick<
  SearchFieldsProps,
  'mode' | 'guestsOpen' | 'onGuestsOpenChange' | 'calendarOpen' | 'onCalendarOpenChange' | 'adults' | 'children' | 'pets' | 'setAdults' | 'setChildren' | 'setPets' | 'onUpdateGuests' | 'guestsRef'
>

const CalendarField = ({
  mode,
  date,
  onDateChange,
  calendarOpen,
  onCalendarOpenChange,
  guestsOpen,
  onGuestsOpenChange,
  calendarRef,
}: CalendarFieldProps) => {
  const mobile = mode === 'mobile'

  return (
    <div ref={calendarRef} className={mobile ? 'relative space-y-2' : 'relative w-[27%] shrink-0'}>
      {mobile && <span className="block text-sm font-semibold text-slate-800">Dates</span>}
      <button
        type="button"
        onClick={() => {
          onGuestsOpenChange(false)
          onCalendarOpenChange(!calendarOpen)
        }}
        className={mobile
          ? 'group flex h-12 w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 text-left transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30'
          : 'group flex w-full items-center gap-1.5 rounded-full px-2 py-1 text-left transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30'}
        aria-expanded={calendarOpen}
        aria-haspopup="dialog"
      >
        <CalendarDays className={mobile ? 'h-5 w-5 shrink-0 text-emerald-600' : 'h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-emerald-600'} />
        <span className={mobile ? 'truncate text-sm font-medium text-slate-700' : 'min-w-0 flex-1'}>
          <span className={mobile ? undefined : 'block truncate text-xs font-semibold text-slate-700'}>
            {date ? date.toLocaleDateString('fr-FR') : mobile ? 'Choisissez vos dates' : 'Toutes dates'}
          </span>
        </span>
      </button>
      {calendarOpen && (
        <div className={mobile
          ? 'absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[60] rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl'
          : 'absolute right-0 top-[calc(100%+0.75rem)] z-[60] rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl'}>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              onDateChange(selectedDate)
              onCalendarOpenChange(false)
            }}
            disabled={{ before: new Date() }}
          />
        </div>
      )}
    </div>
  )
}

const GuestsField = ({
  mode,
  guestsOpen,
  onGuestsOpenChange,
  calendarOpen,
  onCalendarOpenChange,
  adults,
  children,
  pets,
  setAdults,
  setChildren,
  setPets,
  onUpdateGuests,
  guestsRef,
}: GuestsFieldProps) => {
  const mobile = mode === 'mobile'
  const totalGuests = adults + children
  const guestRows = [
    { label: 'Adultes', detail: '13 ans et plus', value: adults, setter: setAdults, minimum: 1 },
    { label: 'Enfants', detail: 'De 2 à 12 ans', value: children, setter: setChildren, minimum: 0 },
    { label: 'Animaux de compagnie', detail: 'Vous voyagez avec eux ?', value: pets, setter: setPets, minimum: 0 },
  ]

  return (
    <div ref={guestsRef} className={mobile ? 'relative space-y-2' : 'relative w-[27%] shrink-0'}>
      {mobile && <span className="block text-sm font-semibold text-slate-800">Voyageurs</span>}
      <button
        type="button"
        onClick={() => {
          onCalendarOpenChange(false)
          onGuestsOpenChange(!guestsOpen)
        }}
        className={mobile
          ? 'group flex h-12 w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 text-left transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30'
          : 'group flex w-full items-center gap-1.5 rounded-full px-2 py-1 text-left transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30'}
        aria-expanded={guestsOpen}
        aria-haspopup="dialog"
      >
        <Users className={mobile ? 'h-5 w-5 shrink-0 text-emerald-600' : 'h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-emerald-600'} />
        <span className={mobile ? 'min-w-0 flex-1 truncate text-sm font-medium text-slate-700' : 'min-w-0 flex-1 truncate text-xs font-semibold text-slate-700'}>
          {totalGuests} voyageur{totalGuests > 1 ? 's' : ''}{pets > 0 ? ` · ${pets} animal${pets > 1 ? 'x' : ''}` : ''}
        </span>
      </button>
      {guestsOpen && (
        <div className={mobile
          ? 'absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[60] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl'
          : 'absolute right-0 top-[calc(100%+0.75rem)] z-[60] w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl'}>
          <div className="mb-3 border-b border-slate-100 pb-3">
            <p className="text-sm font-bold text-slate-900">Voyageurs</p>
            <p className="mt-1 text-xs text-slate-500">Ajoutez les personnes et animaux du séjour.</p>
          </div>
          <div className="space-y-4">
            {guestRows.map(({ label, detail, value, setter, minimum }) => (
              <div key={label} className="flex items-center justify-between gap-4">
                <span className="min-w-0"><span className="block text-sm font-semibold text-slate-800">{label}</span><span className="block text-[11px] text-slate-500">{detail}</span></span>
                <span className="flex shrink-0 items-center gap-2">
                  <button type="button" onClick={() => onUpdateGuests(setter, -1, minimum)} disabled={value <= minimum} aria-label={`Retirer ${label}`} className="grid h-7 w-7 place-items-center rounded-full border border-slate-300 text-slate-600 transition hover:border-emerald-600 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-30"><Minus className="h-3.5 w-3.5" /></button>
                  <span className="w-5 text-center text-sm font-bold text-slate-800">{value}</span>
                  <button type="button" onClick={() => onUpdateGuests(setter, 1, minimum)} aria-label={`Ajouter ${label}`} className="grid h-7 w-7 place-items-center rounded-full border border-slate-300 text-slate-600 transition hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"><Plus className="h-3.5 w-3.5" /></button>
                </span>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => onGuestsOpenChange(false)} className="mt-4 w-full border-t border-slate-100 pt-3 text-right text-xs font-bold text-emerald-700 transition hover:text-emerald-900">Terminé</button>
        </div>
      )}
    </div>
  )
}

export const SearchFields = (props: SearchFieldsProps) => {
  const { mode, destination, onDestinationChange } = props
  const mobile = mode === 'mobile'

  return (
    <>
      <label className={mobile ? 'block space-y-2' : 'group flex w-[36%] min-w-0 shrink-0 items-center gap-1 rounded-full px-2 py-0.5 transition-colors hover:bg-white focus-within:bg-white focus-within:shadow-sm'}>
        {mobile && <span className="text-sm font-semibold text-slate-800">Destination</span>}
        <span className={mobile ? 'flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 transition-colors focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/10' : 'min-w-0 flex justify-between items-center gap-1.5'}>
          <MapPin className={mobile ? 'h-5 w-5 shrink-0 text-emerald-600' : 'h-4 w-4 shrink-0 text-emerald-600 transition-colors group-hover:text-emerald-700'} />
          <span className="min-w-0 flex-1">
            <Input value={destination} onChange={(event) => onDestinationChange(event.target.value)} placeholder="Où allez-vous ?" className={mobile ? 'h-10 min-w-0 border-0 bg-transparent p-0 text-sm font-medium shadow-none placeholder:text-slate-400 focus-visible:ring-0' : 'h-5 border-0 bg-transparent p-0 text-sm font-semibold shadow-none placeholder:text-slate-400 focus-visible:ring-0'} />
          </span>
        </span>
      </label>
      {!mobile && <div className="h-5 w-px bg-slate-200" />}
      <CalendarField {...props} />
      {!mobile && <div className="h-5 w-px bg-slate-200" />}
      <GuestsField {...props} />
      {!mobile && <Button type="submit" size="icon" aria-label="Rechercher" className="h-8 w-8 shrink-0 rounded-full bg-emerald-700 text-white shadow-sm transition-all hover:scale-105 hover:bg-emerald-800 hover:shadow-md focus-visible:ring-2 focus-visible:ring-emerald-500/40"><Search className="h-4 w-4" /></Button>}
    </>
  )
}
