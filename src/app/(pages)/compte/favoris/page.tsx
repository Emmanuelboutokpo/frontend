'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Heart, MapPin, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AuthDialog from '@/components/front-office/AuthDialog'
import { useAuthStore, usePropertyStore } from '@/store'
import PropertyShowcase from '@/components/front-office/PropertyShowcase'
import { formatLocation } from '@/utils/selectors'



const FavoritesPage = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const [authOpen, setAuthOpen] = useState(false)
    const data = usePropertyStore((state) => state.data)
    const favoriteIds = usePropertyStore((state) => state.favoriteIds)

    useEffect(() => {
        if (!isAuthenticated) setAuthOpen(true)
    }, [isAuthenticated])

    const countries = useMemo(() => Object.fromEntries(data.Countries.map((country) => [country.id, country.name])), [data.Countries])
    const photos = useMemo(() => Object.fromEntries(data.Photos.filter((photo) => photo.is_cover).map((photo) => [photo.establishment_id, photo])), [data.Photos])
    const subcategorySlugs = useMemo(() => Object.fromEntries(data.SubCategories.map((subcategory) => [subcategory.id, subcategory.slug])), [data.SubCategories])
    const favorites = data.Establishments.filter((property) => favoriteIds.includes(property.id))
    const countryGroups = data.Countries.map((country) => ({ country, properties: favorites.filter((property) => property.country_id === country.id) })).filter((group) => group.properties.length > 0)

    return (
        <main className="min-h-screen bg-[#f5fbf7] pb-20 text-slate-900">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-12">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700"><ArrowLeft className="h-4 w-4" />Retour à l&apos;accueil</Link>
                <header className="mt-7 flex flex-col justify-between gap-4 border-b border-slate-200 pb-7 sm:flex-row sm:items-end">
                    <div>
                        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700"><Heart className="h-4 w-4 fill-current" />Votre sélection</p>
                        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Mes favoris</h1>
                        <p className="mt-3 text-slate-600">Retrouvez les établissements que vous souhaitez garder à portée de main.</p>
                    </div>
                    <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">{favorites.length} établissement{favorites.length > 1 ? 's' : ''}</span>
                </header>

                {!isAuthenticated ?
                    <div className="mt-16 rounded-3xl border border-emerald-100 bg-white px-6 py-16 text-center shadow-sm">
                        <Heart className="mx-auto h-10 w-10 text-emerald-600" />
                        <h2 className="mt-5 text-2xl font-bold">
                            Connectez-vous pour retrouver vos favoris
                        </h2>
                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                            Votre sélection sera conservée et accessible depuis tous vos appareils.
                        </p>
                        <Button type="button" onClick={() => setAuthOpen(true)} className="mt-7 rounded-full bg-emerald-700 hover:bg-emerald-800">Se connecter</Button>
                    </div> :
                    favorites.length === 0 ?
                        <div className="mt-16 rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                            <Sparkles className="mx-auto h-10 w-10 text-emerald-600" />
                            <h2 className="mt-5 text-2xl font-bold">Votre sélection est vide</h2>
                            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                                Explorez nos établissements et appuyez sur le cœur pour enregistrer vos adresses préférées.
                            </p>
                            <Button asChild className="mt-7 rounded-full bg-emerald-700 hover:bg-emerald-800">
                                <Link href="/explorer">Explorer les établissements</Link>
                            </Button>
                        </div> :
                        <div className="mt-9 space-y-12">
                            {countryGroups.map(({ country, properties }) => {
                                const categories = data.Categories.map((category) => ({ category, properties: properties.filter((property) => property.category_id === category.id) })).filter((group) => group.properties.length > 0)
                                return <section key={country.id} aria-labelledby={`country-${country.id}`}>
                                    <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-100 text-emerald-700"><MapPin className="h-5 w-5" /></span><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Pays</p><h2 id={`country-${country.id}`} className="text-2xl font-bold">{country.name}</h2></div></div>
                                    <div className="mt-6 space-y-8">
                                        {categories.map(({ category, properties: categoryProperties }) =>
                                            <div key={category.id}>
                                                <div className="mb-4 flex items-center justify-between sm:justify-start gap-3">
                                                    <h3 className="text-lg font-bold">{category.name}</h3>
                                                    <span className="text-sm text-slate-400">{categoryProperties.length} établissement{categoryProperties.length > 1 ? 's' : ''}</span>
                                                </div>
                                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                                    {categoryProperties.map((est) => {
                                                        const photos = useMemo(() => Object.fromEntries(data.Photos.filter((photo) => photo.is_cover).map((photo) => [photo.establishment_id, photo])), [data.Photos])
                                                        const subcategorySlugs = useMemo(() => Object.fromEntries(data.SubCategories.map((subcategory) => [subcategory.id, subcategory.slug])), [data.SubCategories])

                                                        const category = data.Categories.find((c) => c.id === est.category_id);
                                                        const subcategory = data.SubCategories.find(
                                                            (sc) => sc.id === est.subcategory_id
                                                        );
                                                        const location = formatLocation(data, est) || est.address;

                                                        return (
                                                            <PropertyShowcase
                                                                key={est.id}
                                                                property={est}
                                                                photo={photos[est.id]}
                                                                subcategorySlugs={subcategorySlugs}
                                                                typeName={subcategory?.name ?? category?.name ?? "Établissement"}
                                                                location={location}
                                                            />
                                                        );
                                                    })}

                                                </div>
                                            </div>)}
                                    </div>
                                </section>
                            })}
                        </div>}
            </div>
            <AuthDialog open={authOpen} onOpenChange={setAuthOpen} title="Connectez-vous pour accéder à vos favoris" />
        </main>
    )
}

export default FavoritesPage