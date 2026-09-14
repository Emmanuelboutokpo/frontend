'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Heart, MapPin, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import AuthDialog from '@/components/front-office/AuthDialog'
import { Establishment, Photo } from '../../../types/types'
import { usePropertyStore } from '../../../store'
import { useAuthStore } from '../../../store/authStore'
  
type PropertyCardProps = {
    property: Establishment
    countryName: string
    photo?: Photo
    subcategorySlugs: Record<number, string>
}

type PropertySectionProps = {
    eyebrow: string
    title: string
    properties: Establishment[]
    countries: Record<number, string>
    photos: Record<number, Photo>
    subcategorySlugs: Record<number, string>
    href?: string
}

const categoryPaths: Record<number, string> = {
    1: 'hebergement',
    2: 'restaurant',
    3: 'loisir',
}

export function PropertyCard({ property, countryName, photo, subcategorySlugs }: PropertyCardProps) {
    const favorite = usePropertyStore((state) => state.favoriteIds.includes(property.id))
    const toggleFavorite = usePropertyStore((state) => state.toggleFavorite)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const [authOpen, setAuthOpen] = useState(false)
    const categoryPath = categoryPaths[property.category_id] ?? 'hebergement'
    const subcategoryPath = property.subcategory_id ? `/${subcategorySlugs[property.subcategory_id]}` : ''
    const href = `/pages/front-office/${categoryPath}${subcategoryPath}/${property.slug}`

    return (
        <Card className="group relative overflow-hidden border-slate-100 bg-white py-0 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <Link href={href} aria-label={`Voir ${property.name}`} className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600" />
            <div className="relative aspect-[1.35/1] overflow-hidden bg-emerald-50">
                {photo ? <img src={photo.url} alt={property.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="grid h-full place-items-center text-emerald-700"><MapPin className="h-8 w-8" /></div>}
                <button type="button" aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'} onClick={(event) => { event.preventDefault(); event.stopPropagation(); if (isAuthenticated) toggleFavorite(property.id); else setAuthOpen(true) }} className={`absolute right-2 top-2 z-20 grid h-8 w-8 place-items-center rounded-full bg-white/90 transition ${favorite ? 'text-rose-500' : 'text-slate-600 hover:text-rose-500'}`}>
                    <Heart className={`h-4 w-4 ${favorite ? 'fill-current' : ''}`} />
                </button>
            </div>
            <CardContent className="relative z-0 p-3">
                <div>
                    <p className="flex items-center gap-1 text-[11px] font-medium text-slate-400"><MapPin className="h-3 w-3" />{countryName}</p>
                    <h3 className="mt-1 line-clamp-1 text-sm font-bold group-hover:text-emerald-700">{property.name}</h3>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 text-xs">
                    <span className="flex items-center gap-1 text-amber-500"><Star className="h-3 w-3 fill-current" /><strong>{property.rating.toFixed(1)}</strong></span>
                    <span className="truncate text-right font-semibold text-slate-700">{property.price_per_night ? `${property.price_per_night.toLocaleString('fr-FR')} ${property.currency}` : 'Nous consulter'}</span>
                </div>
            </CardContent>
            <AuthDialog open={authOpen} onOpenChange={setAuthOpen} onAuthenticated={() => toggleFavorite(property.id)} title="Connectez-vous pour enregistrer ce favori" />
        </Card>
    )
}

export function PropertySection({ eyebrow, title, properties, countries, photos, subcategorySlugs, href }: PropertySectionProps) {
    const [expanded, setExpanded] = useState(false)
    const visibleProperties = expanded ? properties : properties.slice(0, 4)

    if (properties.length === 0) return null

    return (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-12">
            <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{eyebrow}</p>
                    <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
                </div>
                {href && <Button asChild variant="ghost" className="shrink-0 text-emerald-700 sm:flex">
                    <Link href={href}>Explorer <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>}
            </div>
            <Carousel opts={{ align: 'start', loop: false }} className="-mx-1 px-1 sm:-mx-2 sm:px-2">
                <CarouselContent className="-ml-3 sm:-ml-4">
                    {visibleProperties.map((property) => <CarouselItem key={property.id} className="basis-[78%] pl-3 sm:basis-[42%] sm:pl-4 lg:basis-1/4">
                        <PropertyCard property={property} countryName={countries[property.country_id] ?? 'Pays inconnu'} photo={photos[property.id]} subcategorySlugs={subcategorySlugs} />
                    </CarouselItem>)}
                </CarouselContent>
                {/* {visibleProperties.length > 1 && <>
                    <CarouselPrevious className="-left-3 hidden border-slate-200 bg-white/95 sm:flex" />
                    <CarouselNext className="-right-3 hidden border-slate-200 bg-white/95 sm:flex" />
                </>} */}
            </Carousel>
        </section>
    )
}
