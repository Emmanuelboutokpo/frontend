'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  CalendarDays,
  Heart,
  MapPin,
  Send,
  ShieldCheck,
  Star,
 
} from 'lucide-react'

import AuthDialog from '@/components/front-office/AuthDialog'
import { Card, CardContent } from '@/components/ui/card'
import { amenityIconMap, Establishment, Photo } from '@/types/types'
import { useAmenities, useAuthStore, usePropertyStore } from '@/store'
import { Badge } from '@/components/ui/badge'

const categoryPaths: Record<number, string> = { 1: 'hebergement', 2: 'restaurant', 3: 'loisir' }


function formatPrice(property: Establishment) {
  const price = property.price_per_night ?? property.price_per_month

  if (!price) {
    return 'Prix sur demande'
  }

  const formattedPrice = price.toLocaleString('fr-FR')

  // Hébergement
  if (property.category_id === 1) {
    if (property.price_per_night) {
      return `${formattedPrice} ${property.currency} / nuit`
    }

    return `${formattedPrice} ${property.currency} / mois`
  }

  // Restaurant
  if (property.category_id === 2) {
    return `${formattedPrice} ${property.currency} / personne`
  }

  // Loisirs
  if (property.category_id === 3) {
    return `${formattedPrice} ${property.currency} / personne`
  }

  return `${formattedPrice} ${property.currency}`
}

function propertyHref(property: Establishment, subcategorySlugs: Record<number, string>) {
  const categoryPath = categoryPaths[property.category_id] ?? 'hebergement'
  const subcategoryPath = property.subcategory_id ? `/${subcategorySlugs[property.subcategory_id]}` : ''
  return `/pages/${categoryPath}${subcategoryPath}/${property.slug}`
}

function PropertyShowcase({ property, photo, typeName, location, subcategorySlugs }: { property: Establishment; photo?: Photo; subcategorySlugs: Record<number, string> ;  typeName: string; location: string;}) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const favorite = usePropertyStore((state) => state.favoriteIds.includes(property.id))
  const toggleFavorite = usePropertyStore((state) => state.toggleFavorite)
  const [authOpen, setAuthOpen] = useState(false)
  const allAmenities = useAmenities();

  const establishmentAmenities = allAmenities
    .filter((a) => property.amenity_ids.includes(a.id))
    .slice(0, 3);

  return (
    <Card className="group relative overflow-hidden border-slate-100 bg-white py-0 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={propertyHref(property, subcategorySlugs)} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
        <div className="relative aspect-[1.36/1] overflow-hidden bg-slate-100 shadow-sm">
          {photo ? <img src={photo.url} alt={property.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="grid h-full place-items-center text-slate-400"><MapPin className="h-7 w-7" /></div>}
          <div className="absolute left-2.5 top-2.5 z-20 flex items-center gap-1 rounded-md bg-white/95 px-2 py-1 shadow-sm backdrop-blur">
          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
          <span className="text-xs font-bold text-slate-800">
            {property.rating.toFixed(1)}
          </span>
          <span className="text-[10px] text-muted-foreground">
            ({property.review_ids.length})
          </span>
        </div>
        <Badge
        variant="secondary"
        className="absolute bottom-2.5 left-2.5 z-20 bg-white/95 text-[10px] font-semibold backdrop-blur"
        >
          {typeName}
        </Badge>
        </div>
        <CardContent className="relative z-0 p-3">
          <div className="flex flex-1 flex-col justify-between p-3.5">
                  <div>
                    <h3 className="mb-1 block font-semibold text-slate-900 transition hover:text-emerald-700 line-clamp-1 text-sm font-bold">{property.name}</h3>
                    <p className="mb-2.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0 text-emerald-600" />
                      <span className="truncate">{location}</span>
                    </p>
          
                    {/* Équipements */}
                    {establishmentAmenities.length > 0 && (
                      <div className="mb-3 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                        {establishmentAmenities.map((amenity) => {
                          const IconComponent =
                            amenityIconMap[amenity.slug] ?? amenityIconMap.default;
                          return (
                            <span
                              key={amenity.id}
                              className="flex items-center gap-1 rounded bg-muted/60 px-1.5 py-0.5"
                            >
                              <IconComponent className="h-3 w-3 text-emerald-700" />
                              {amenity.name}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
          
                  {/* Prix & Lien */}
                  <div className="flex items-end justify-between border-t border-slate-100 pt-2.5">
                    <div>
                      <span className="block text-[10px] text-muted-foreground">À partir de</span>
                      <p className="text-[12px] sm:text-[11px] font-bold text-emerald-800">
                        {formatPrice(property)}
                      </p>
                    </div>
                    <p
                      className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                    >
                      Voir détails
                    </p>
                  </div>
                </div>
    
      </CardContent>
      </Link>
      <button type="button" aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'} onClick={() => isAuthenticated ? toggleFavorite(property.id) : setAuthOpen(true)} className={`absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/95 shadow-sm transition hover:scale-105 ${favorite ? 'text-rose-500' : 'text-slate-600 hover:text-rose-500'}`}><Heart className={`h-4 w-4 ${favorite ? 'fill-current' : ''}`} /></button>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} onAuthenticated={() => toggleFavorite(property.id)} title="Connectez-vous pour enregistrer ce favori" />
    </Card>
  )
}

export default PropertyShowcase
