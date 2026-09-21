'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    ArrowRight,
    CalendarDays,
    Check,
    ChevronRight,
    Clock3,
    Compass,
    Heart,
    MapPin,
    Search,
    ShieldCheck,
    Sparkles,
    Star,
    Ticket,
    Utensils,
    BedDouble,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TravelBanner } from '@/components/front-office/TravelBanner'
import { usePropertyStore } from '@/store'
import { getCoverPhoto, formatLocation } from '@/utils/selectors'

const categoryIconMap: Record<string, { icon: typeof Compass; color: string }> = {
    hebergement: { icon: BedDouble, color: 'bg-blue-50 text-blue-700' },
    restaurant: { icon: Utensils, color: 'bg-amber-50 text-amber-700' },
    loisir: { icon: Compass, color: 'bg-emerald-50 text-emerald-700' },
}

function Rating({ value, reviews }: { value: number; reviews: number }) {
    return (
        <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="flex gap-0.5 text-amber-500">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                        key={index}
                        className={`h-3.5 w-3.5 ${index < Math.round(value) ? 'fill-current' : ''}`}
                    />
                ))}
            </span>
            <strong>{value.toFixed(1)}</strong>
            <span className="text-slate-400">({reviews} avis)</span>
        </div>
    )
}

export default function Reservation() {
    const router = useRouter()
    const data = usePropertyStore((state) => state.data)
    const favoriteIds = usePropertyStore((state) => state.favoriteIds)
    const toggleFavorite = usePropertyStore((state) => state.toggleFavorite)

    const [destinationInput, setDestinationInput] = useState('')

    // Villes / Communes du Bénin disponibles dans le store
    const availableCommunes = useMemo(
        () => data.Communes.slice(0, 5),
        [data.Communes]
    )

    const [activeCommuneId, setActiveCommuneId] = useState<number>(
        availableCommunes[0]?.id ?? 1
    )

    // Établissements approuvés
    const approved = useMemo(
        () => data.Establishments.filter((e) => e.status === 'APPROVED'),
        [data.Establishments]
    )

    // Expériences / Établissements incontournables (mieux notés)
    const mustSeeExperiences = useMemo(
        () =>
            [...approved]
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 3),
        [approved]
    )

    // Établissements par commune sélectionnée
    const establishmentsInActiveCommune = useMemo(
        () =>
            approved.filter((e) => e.commune_id === activeCommuneId).slice(0, 3),
        [approved, activeCommuneId]
    )

    const activeCommuneName =
        data.Communes.find((c) => c.id === activeCommuneId)?.name ?? 'Cotonou'

    const handleSearchSubmit = () => {
        if (destinationInput.trim()) {
            router.push(`/pages/front-office/explorer?keyword=${encodeURIComponent(destinationInput.trim())}`)
        } else {
            router.push('/pages/front-office/explorer')
        }
    }

    return (
        <main className="min-h-screen bg-[#f5fbf7] text-slate-900">
            <TravelBanner />

            {/* BARRE DE RECHERCHE PRINCIPALE */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#fbf7ef] via-[#eff8f2] to-[#f5fbf7] px-4 pb-14 pt-10 sm:px-6 lg:px-12">
                <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
                    <div className="mt-9 flex w-full max-w-5xl flex-col gap-2 rounded-3xl bg-white p-3 text-left shadow-xl sm:flex-row sm:items-center sm:rounded-full">
                        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-4 py-2 hover:bg-slate-50 sm:rounded-full">
                            <MapPin className="h-5 w-5 shrink-0 text-emerald-600" />
                            <span className="min-w-0">
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    Destination
                                </span>
                                <input
                                    value={destinationInput}
                                    onChange={(e) => setDestinationInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                                    className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-500"
                                    placeholder="Où souhaitez-vous aller au Bénin ?"
                                />
                            </span>
                        </label>
                        <div className="hidden h-8 w-px bg-slate-200 sm:block" />
                        <Link
                            href="/pages/front-office/explorer"
                            className="flex items-center gap-3 rounded-2xl px-4 py-2 text-left hover:bg-slate-50 sm:rounded-full"
                        >
                            <CalendarDays className="h-5 w-5 text-slate-400" />
                            <span>
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    Quand ?
                                </span>
                                <span className="text-sm font-semibold">Toutes dates</span>
                            </span>
                        </Link>
                        <div className="hidden h-8 w-px bg-slate-200 sm:block" />
                        <Link
                            href="/pages/front-office/explorer"
                            className="flex items-center gap-3 rounded-2xl px-4 py-2 text-left hover:bg-slate-50 sm:rounded-full"
                        >
                            <Sparkles className="h-5 w-5 text-slate-400" />
                            <span>
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    Type d’établissement
                                </span>
                                <span className="text-sm font-semibold">Toutes catégories</span>
                            </span>
                        </Link>
                        <Button
                            onClick={handleSearchSubmit}
                            className="h-12 rounded-full bg-emerald-700 px-7 hover:bg-emerald-800"
                        >
                            <Search className="mr-2 h-4 w-4" />
                            Rechercher
                        </Button>
                    </div>

                    <div className="mt-9 grid w-full max-w-5xl gap-3 text-left md:grid-cols-3">
                        {[
                            ['Annulation flexible', 'Conditions claires et transparentes', Clock3],
                            ['Avis de voyageurs vérifiés', 'Des expériences réelles au Bénin', Star],
                            ['Meilleurs prix garantis', 'Directement avec les promoteurs locaux', Check],
                        ].map(([title, detail, Icon]) => (
                            <div
                                key={title as string}
                                className="flex items-center gap-3 rounded-2xl bg-white/80 p-4 shadow-sm"
                            >
                                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">{title as string}</p>
                                    <p className="text-xs text-slate-500">{detail as string}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* EXPLORER PAR CATÉGORIE */}
            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-12">
                <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                            Inspirations
                        </p>
                        <h2 className="mt-1 text-3xl font-bold tracking-tight">
                            Explorer par catégorie
                        </h2>
                    </div>
                    <p className="hidden max-w-sm text-right text-sm text-slate-500 md:block">
                        Trouvez l’adresse qui correspond à votre rythme.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {data.Categories.map((category) => {
                        const meta = categoryIconMap[category.slug] ?? {
                            icon: Compass,
                            color: 'bg-emerald-50 text-emerald-700',
                        }
                        const Icon = meta.icon
                        const count = approved.filter(
                            (e) => e.category_id === category.id
                        ).length

                        return (
                            <Link
                                key={category.id}
                                href={`/pages/front-office/${category.slug}`}
                                className="group rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <div
                                    className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${meta.color}`}
                                >
                                    <Icon className="h-7 w-7" />
                                </div>
                                <p className="mt-3 text-base font-bold text-slate-900 group-hover:text-emerald-700">
                                    {category.name}s
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    {count} adresse{count > 1 ? 's' : ''} disponible
                                    {count > 1 ? 's' : ''}
                                </p>
                            </Link>
                        )
                    })}
                </div>
            </section>

            {/* EXPÉRIENCES INCONTOURNABLES */}
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-12">
                <div className="mb-7 flex items-end justify-between gap-4">
                    <div>
                        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                            <Sparkles className="h-4 w-4" /> Sélection officielle
                        </p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight">
                            Adresses incontournables
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Les établissements les plus appréciés par notre communauté.
                        </p>
                    </div>
                    <Button
                        asChild
                        variant="outline"
                        className="hidden rounded-full sm:flex"
                    >
                        <Link href="/pages/front-office/explorer">
                            Tout découvrir <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                    {mustSeeExperiences.map((est) => {
                        const cover = getCoverPhoto(data, est.id)
                        const category = data.Categories.find(
                            (c) => c.id === est.category_id
                        )
                        const subcategory = data.SubCategories.find(
                            (sc) => sc.id === est.subcategory_id
                        )
                        const isFav = favoriteIds.includes(est.id)
                        const location = formatLocation(data, est) || est.address
                        const price = est.price_per_night ?? est.price_per_month ?? 0
                        const subPath = subcategory?.slug ? `/${subcategory.slug}` : ''
                        const detailUrl = `/pages/front-office/${category?.slug ?? 'hebergement'}${subPath}/${est.slug}`

                        return (
                            <Card
                                key={est.id}
                                className="group overflow-hidden border-0 bg-white py-0 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    {cover?.url ? (
                                        <img
                                            src={cover.url}
                                            alt={est.name}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
                                            Pas d'image
                                        </div>
                                    )}
                                    <span className="absolute left-3 top-3 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-bold text-white">
                                        {subcategory?.name ?? category?.name ?? 'Top Choix'}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            toggleFavorite(est.id)
                                        }}
                                        aria-label="Ajouter aux favoris"
                                        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-slate-600 shadow-sm transition hover:scale-110"
                                    >
                                        <Heart
                                            className={`h-4 w-4 ${
                                                isFav ? 'fill-red-500 text-red-500' : ''
                                            }`}
                                        />
                                    </button>
                                </div>
                                <CardContent className="p-5">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        {location}
                                    </p>
                                    <Link href={detailUrl}>
                                        <h3 className="mt-1 line-clamp-2 font-bold leading-6 hover:text-emerald-700">
                                            {est.name}
                                        </h3>
                                    </Link>
                                    <Rating
                                        value={est.rating}
                                        reviews={est.review_ids.length}
                                    />
                                    <div className="mt-5 flex items-end justify-between border-t pt-4">
                                        <span className="text-xs text-slate-400">
                                            {category?.name}
                                        </span>
                                        <span className="text-right">
                                            <small className="block text-xs text-slate-400">
                                                dès
                                            </small>
                                            <strong className="text-emerald-800">
                                                {price > 0
                                                    ? `${price.toLocaleString('fr-FR')} ${est.currency}`
                                                    : 'Sur demande'}
                                            </strong>
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </section>

            {/* VILLES PHARES DU STORE */}
            <section className="mt-8 bg-white px-4 py-14 sm:px-6 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                                Villes phares
                            </p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight">
                                Les trésors des communes béninoises
                            </h2>
                        </div>
                        <p className="max-w-sm text-sm text-slate-500">
                            Découvrez les adresses à vivre dans chaque commune.
                        </p>
                    </div>

                    {/* Onglets des communes */}
                    <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
                        {availableCommunes.map((commune) => (
                            <button
                                key={commune.id}
                                onClick={() => setActiveCommuneId(commune.id)}
                                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                                    activeCommuneId === commune.id
                                        ? 'bg-slate-950 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-emerald-100'
                                }`}
                            >
                                {commune.name}
                            </button>
                        ))}
                    </div>

                    {/* Établissements de la commune sélectionnée */}
                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                        {establishmentsInActiveCommune.length > 0 ? (
                            establishmentsInActiveCommune.map((est) => {
                                const category = data.Categories.find(
                                    (c) => c.id === est.category_id
                                )
                                const subcategory = data.SubCategories.find(
                                    (sc) => sc.id === est.subcategory_id
                                )
                                const subPath = subcategory?.slug ? `/${subcategory.slug}` : ''
                                const detailUrl = `/pages/front-office/${category?.slug ?? 'hebergement'}${subPath}/${est.slug}`

                                return (
                                    <Link
                                        href={detailUrl}
                                        key={est.id}
                                        className="group rounded-2xl bg-[#f5fbf7] p-6 transition hover:bg-emerald-50 hover:shadow-sm"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="grid h-11 w-11 place-items-center rounded-xl bg-white text-emerald-700 shadow-sm">
                                                <Compass className="h-5 w-5" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-400">
                                                ★ {est.rating.toFixed(1)}
                                            </span>
                                        </div>
                                        <h3 className="mt-6 font-bold text-slate-900 group-hover:text-emerald-700 line-clamp-1">
                                            {est.name}
                                        </h3>
                                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                                            {est.description}
                                        </p>
                                        <div className="mt-4 flex items-center justify-between text-xs font-semibold text-emerald-700">
                                            <span>En savoir plus</span>
                                            <ChevronRight className="h-4 w-4" />
                                        </div>
                                    </Link>
                                )
                            })
                        ) : (
                            <div className="col-span-3 rounded-2xl border border-dashed p-8 text-center text-slate-500">
                                Aucune adresse répertoriée pour le moment à {activeCommuneName}.
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}