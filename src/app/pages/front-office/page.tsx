'use client'

import Link from 'next/link'
import { ArrowRight, BedDouble, Compass, MapPin, Utensils } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PropertySection } from '@/components/front-office/PropertyShowcase'
import { usePropertyStore } from '../../../../store'

const categoryIcons = {
    hebergement: BedDouble,
    restaurant: Utensils,
    loisir: Compass,
} as const

export default function Home() {
    const data = usePropertyStore((state) => state.data)
    const countries = Object.fromEntries(data.Countries.map((country) => [country.id, country.name]))
    const photos = Object.fromEntries(data.Photos.filter((photo) => photo.is_cover).map((photo) => [photo.establishment_id, photo]))
    const subcategorySlugs = Object.fromEntries(data.SubCategories.map((subcategory) => [subcategory.id, subcategory.slug]))

    return (
        <main className="min-h-screen bg-[#f5fbf7] text-slate-900">
            <div className="bg-white/60">
                {/* {data.Countries.map((country) => {
                    const properties = data.Establishments.filter((property) => property.country_id === country.id)
                    return <PropertySection key={country.id} eyebrow={`Découvrez nos adresses au`} title={country.name} properties={properties} countries={countries} photos={photos} subcategorySlugs={subcategorySlugs} href={`/pages/front-office?country=${country.id}`} />
                })} */}

                {data.Categories.map((category) => {
                    const properties = data.Establishments.filter((property) => property.category_id === category.id)
                    return <PropertySection key={category.id} eyebrow={`Explorez nos offres`} title={category.name} properties={properties} countries={countries} photos={photos} subcategorySlugs={subcategorySlugs} href={`/pages/front-office/${category.slug}`} />
                })}

                {data.SubCategories.map((subcategory) => {
                    const properties = data.Establishments.filter((property) => property.subcategory_id === subcategory.id)
                    const categoryPath = data.Categories.find((category) => category.id === subcategory.category_id)?.slug ?? 'hebergement'
                    return <PropertySection key={subcategory.id} eyebrow={`Sélection `} title={subcategory.name} properties={properties} countries={countries} photos={photos} subcategorySlugs={subcategorySlugs} href={`/pages/front-office/${categoryPath}`} />
                })}
            </div>
        </main>
    )
}
