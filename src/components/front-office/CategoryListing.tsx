'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowDownUp, BedDouble, Check, Compass, Filter, MapPin, Search, SlidersHorizontal, Star, Utensils, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PropertyCard } from '@/components/front-office/PropertyShowcase'
import { usePropertyStore } from '../../../store'
import type { CategorySlug } from '../../../types/types'

type CategoryListingProps = { slug: CategorySlug }
type SortValue = 'recommended' | 'rating' | 'price-low' | 'price-high'

const categoryContent: Record<CategorySlug, { title: string; description: string; icon: typeof BedDouble }> = {
    hebergement: { title: 'Hébergements', description: 'Des adresses confortables pour vos séjours, partout où vous allez.', icon: BedDouble },
    restaurant: { title: 'Restaurants', description: 'Des tables sélectionnées pour découvrir les meilleurs goûts locaux.', icon: Utensils },
    loisir: { title: 'Loisirs', description: 'Des lieux et activités pour remplir vos journées de beaux souvenirs.', icon: Compass },
}

const categoryIds: Record<CategorySlug, number> = { hebergement: 1, restaurant: 2, loisir: 3 }

export default function CategoryListing({ slug }: CategoryListingProps) {
    const data = usePropertyStore((state) => state.data)
    const searchParams = useSearchParams()
    const [query, setQuery] = useState('')
    const [countryId, setCountryId] = useState('all')
    const [subcategoryId, setSubcategoryId] = useState('all')
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')
    const [minimumRating, setMinimumRating] = useState('all')
    const [availabilityOnly, setAvailabilityOnly] = useState(false)
    const [sort, setSort] = useState<SortValue>('recommended')
    const [page, setPage] = useState(1)
    const [filterOpen, setFilterOpen] = useState(false)
    const pageSize = 8
    const content = categoryContent[slug]
    const Icon = content.icon
    const categoryId = categoryIds[slug]

    useEffect(() => {
        setQuery(searchParams.get('destination') ?? '')
        setPage(1)
    }, [searchParams])

    const countries = Object.fromEntries(data.Countries.map((country) => [country.id, country.name]))
    const photos = Object.fromEntries(data.Photos.filter((photo) => photo.is_cover).map((photo) => [photo.establishment_id, photo]))
    const subcategorySlugs = Object.fromEntries(data.SubCategories.map((subcategory) => [subcategory.id, subcategory.slug]))
    const subcategories = data.SubCategories.filter((subcategory) => subcategory.category_id === categoryId)

    const properties = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase()
        const lowerPrice = minPrice ? Number(minPrice) : 0
        const upperPrice = maxPrice ? Number(maxPrice) : Number.MAX_SAFE_INTEGER
        const rating = minimumRating === 'all' ? 0 : Number(minimumRating)
        const filtered = data.Establishments.filter((property) => {
            const propertyPrice = property.price_per_night ?? 0
            return property.category_id === categoryId
                && (countryId === 'all' || property.country_id === Number(countryId))
                && (subcategoryId === 'all' || property.subcategory_id === Number(subcategoryId))
                && (!normalizedQuery || `${property.name} ${property.address} ${property.description}`.toLowerCase().includes(normalizedQuery))
                && propertyPrice >= lowerPrice
                && (property.price_per_night === null || propertyPrice <= upperPrice)
                && property.rating >= rating
                && (!availabilityOnly || property.availability_status === 'AVAILABLE')
        })

        return [...filtered].sort((first, second) => {
            if (sort === 'rating') return second.rating - first.rating
            if (sort === 'price-low') return (first.price_per_night ?? Number.MAX_SAFE_INTEGER) - (second.price_per_night ?? Number.MAX_SAFE_INTEGER)
            if (sort === 'price-high') return (second.price_per_night ?? 0) - (first.price_per_night ?? 0)
            return second.rating - first.rating
        })
    }, [availabilityOnly, categoryId, countryId, data.Establishments, maxPrice, minPrice, minimumRating, query, sort, subcategoryId])

    const visibleProperties = properties.slice(0, page * pageSize)
    const hasMore = visibleProperties.length < properties.length
    const selectedCountry = countryId === 'all' ? undefined : data.Countries.find((country) => country.id === Number(countryId))
    const mapCountry = selectedCountry ?? data.Countries[0]
    const mapUrl = mapCountry ? `https://www.openstreetmap.org/export/embed.html?bbox=${mapCountry.lng - 0.35}%2C${mapCountry.lat - 0.25}%2C${mapCountry.lng + 0.35}%2C${mapCountry.lat + 0.25}&layer=mapnik&marker=${mapCountry.lat}%2C${mapCountry.lng}` : ''
    const activeFilterCount = [countryId !== 'all', subcategoryId !== 'all', Boolean(minPrice), Boolean(maxPrice), minimumRating !== 'all', availabilityOnly].filter(Boolean).length

    const resetFilters = () => {
        setCountryId('all')
        setSubcategoryId('all')
        setMinPrice('')
        setMaxPrice('')
        setMinimumRating('all')
        setAvailabilityOnly(false)
        setPage(1)
    }

    const updateFilter = <T,>(setter: (value: T) => void, value: T) => {
        setter(value)
        setPage(1)
    }

    return (
        <main className="min-h-screen bg-[#f5fbf7] text-slate-900">


            <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-12">
                    <p className="text-sm font-semibold text-slate-700"><span className="text-slate-950">{properties.length}</span> établissement{properties.length > 1 ? 's' : ''}</p>
                    <div className="flex items-center gap-2">
                        <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
                            <DialogTrigger asChild><Button variant="outline" className="rounded-full border-slate-300"><SlidersHorizontal className="mr-2 h-4 w-4" />Filtres{activeFilterCount > 0 && <span className="ml-1 grid h-5 min-w-5 place-items-center rounded-full bg-emerald-700 px-1 text-[11px] text-white">{activeFilterCount}</span>}</Button></DialogTrigger>
                            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-lg">
                                <DialogHeader><DialogTitle>Filtrer {content.title.toLowerCase()}</DialogTitle><DialogDescription>Affinez les résultats selon votre destination, votre budget et vos préférences.</DialogDescription></DialogHeader>
                                <div className="space-y-5 py-2">
                                    <FilterSelect label="Pays" value={countryId} onChange={(value) => updateFilter(setCountryId, value)} options={[{ value: 'all', label: 'Tous les pays' }, ...data.Countries.map((country) => ({ value: String(country.id), label: country.name }))]} />
                                    {subcategories.length > 0 && <FilterSelect label="Sous-catégorie" value={subcategoryId} onChange={(value) => updateFilter(setSubcategoryId, value)} options={[{ value: 'all', label: 'Toutes les sous-catégories' }, ...subcategories.map((subcategory) => ({ value: String(subcategory.id), label: subcategory.name }))]} />}
                                    <div><p className="mb-2 text-sm font-semibold">Prix par nuit (FCFA)</p><div className="grid grid-cols-2 gap-3"><Input type="number" min="0" value={minPrice} onChange={(event) => updateFilter(setMinPrice, event.target.value)} placeholder="Minimum" /><Input type="number" min="0" value={maxPrice} onChange={(event) => updateFilter(setMaxPrice, event.target.value)} placeholder="Maximum" /></div></div>
                                    <FilterSelect label="Note minimale" value={minimumRating} onChange={(value) => updateFilter(setMinimumRating, value)} options={[{ value: 'all', label: 'Toutes les notes' }, { value: '4', label: '4 étoiles et plus' }, { value: '4.5', label: '4,5 étoiles et plus' }]} />
                                    <label className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm font-semibold"><span>Afficher uniquement les disponibles</span><input type="checkbox" checked={availabilityOnly} onChange={(event) => updateFilter(setAvailabilityOnly, event.target.checked)} className="h-4 w-4 accent-emerald-700" /></label>
                                    <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4"><Button type="button" variant="ghost" onClick={resetFilters}>Réinitialiser</Button><Button type="button" onClick={() => setFilterOpen(false)} className="rounded-full bg-emerald-700 px-6 hover:bg-emerald-800">Afficher {properties.length} résultat{properties.length > 1 ? 's' : ''}</Button></div>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <div className="hidden items-center gap-2 rounded-full border border-slate-300 px-3 py-1.5 text-sm md:flex">
                            <ArrowDownUp className="h-4 w-4 text-slate-400" />
                            <Select value={sort} onValueChange={(value) => updateFilter(setSort, value as SortValue)}>
                                <SelectTrigger className="h-8 w-40 border-0 bg-transparent px-0 font-semibold shadow-none focus-visible:ring-0"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="recommended">Recommandés</SelectItem><SelectItem value="rating">Mieux notés</SelectItem><SelectItem value="price-low">Prix croissant</SelectItem><SelectItem value="price-high">Prix décroissant</SelectItem></SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            <section className="mx-auto max-w-[1600px]  px-4 py-5 sm:px-6 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(25rem,0.92fr)]">
                    <div>
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <p className="text-sm text-slate-500">Toutes les propriétés de la catégorie</p>
                            <span className="hidden items-center gap-1 text-xs text-slate-400 sm:flex">
                                <Filter className="h-3.5 w-3.5" />
                                {activeFilterCount ? `${activeFilterCount} filtre${activeFilterCount > 1 ? 's' : ''} actif${activeFilterCount > 1 ? 's' : ''}` : 'Aucun filtre'}
                            </span>
                        </div>
                        {visibleProperties.length > 0 ?
                            <div className="grid gap-4 sm:grid-cols-2">{visibleProperties.map((property) =>
                                <PropertyCard key={property.id} property={property} countryName={countries[property.country_id] ?? 'Pays inconnu'} photo={photos[property.id]} subcategorySlugs={subcategorySlugs} />)}</div> : <EmptyState onReset={() => { setQuery(''); resetFilters() }} />}
                        {hasMore &&
                            <div className="mt-8 flex justify-center">
                                <Button type="button" variant="outline" onClick={() => setPage((value) => value + 1)} className="rounded-full border-emerald-200 px-6 text-emerald-700 hover:bg-emerald-50">
                                    Voir plus de propriétés
                                </Button>
                            </div>
                        }
                    </div>
                    <aside className="lg:block">
                        <div className="sticky top-[5.5rem] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3"><div>
                                <p className="text-sm font-bold">Explorer la carte</p>
                                <p className="text-xs text-slate-500">{mapCountry?.name ?? 'Toutes les destinations'}</p>
                            </div>
                                <MapPin className="h-5 w-5 text-emerald-700" />
                            </div>
                            {mapUrl ?
                                <iframe title={`Carte de ${mapCountry?.name ?? 'la destination'}`} src={mapUrl} className="h-[calc(100vh-10rem)] min-h-[34rem] w-full border-0" loading="lazy" /> :
                                <div className="grid min-h-[34rem] place-items-center text-sm text-slate-500">
                                    Carte indisponible
                                </div>}
                            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
                                <span>{properties.length} résultat{properties.length > 1 ? 's' : ''}</span>
                                <span className="flex items-center gap-1">
                                    <Check className="h-3.5 w-3.5 text-emerald-700" />
                                    Carte centrée
                                </span>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    )
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }> }) {
    return <label className="block">
        <span className="mb-2 block text-sm font-semibold">{label}</span>
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-white px-3 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>{options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
        </Select>
    </label>
}

function EmptyState({ onReset }: { onReset: () => void }) {
    return <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <Search className="mx-auto h-8 w-8 text-slate-300" />
        <h2 className="mt-4 text-lg font-bold">Aucun établissement trouvé</h2>
        <p className="mt-2 text-sm text-slate-500">
            Modifiez vos filtres pour voir d’autres résultats.</p>
            <Button type="button" variant="outline" onClick={onReset} className="mt-5 rounded-full">
                <X className="mr-2 h-4 w-4" />
                Réinitialiser
                </Button>
                </div>
}
