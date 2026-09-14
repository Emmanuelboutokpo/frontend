'use client'

import Link from 'next/link'
import { useState } from 'react'
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TravelBanner } from '@/components/front-office/TravelBanner'

const categories = [
    { label: 'Nature & plein air', detail: '2 400+ activités', icon: Compass, color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Gastronomie & vins', detail: '1 850+ expériences', icon: Utensils, color: 'bg-amber-50 text-amber-700' },
    { label: 'Culture & histoire', detail: '3 120+ visites', icon: Ticket, color: 'bg-sky-50 text-sky-700' },
    { label: 'Activités nautiques', detail: '1 420+ sorties', icon: Compass, color: 'bg-cyan-50 text-cyan-700' },
    { label: 'Visites privées', detail: '980+ exclusives', icon: Sparkles, color: 'bg-rose-50 text-rose-700' },
    { label: 'Billets coupe-file', detail: '4 200+ accès', icon: Ticket, color: 'bg-slate-100 text-slate-700' },
]

const experiences = [
    { city: 'Dakar, Sénégal', title: 'Balade culturelle et gourmande au cœur de Dakar', image: '/images/hero-1.jpeg', rating: '4,9', reviews: '328 avis', price: '15 000 FCFA', tag: 'Choix voyageurs' },
    { city: 'Abidjan, Côte d’Ivoire', title: 'Saveurs locales et marchés secrets d’Abidjan', image: '/images/hero-2.jpeg', rating: '4,8', reviews: '214 avis', price: '22 000 FCFA', tag: 'Populaire' },
    { city: 'Douala, Cameroun', title: 'Les incontournables de la ville avec un guide local', image: '/images/hero-3.jpeg', rating: '4,9', reviews: '167 avis', price: '18 500 FCFA', tag: 'Best-seller' },
]

const destinations = {
    Dakar: ['Île de Gorée et histoire de Dakar', 'Atelier de cuisine sénégalaise', 'Coucher de soleil sur la Corniche'],
    Abidjan: ['Balade street-art à Treichville', 'Maquis et cuisine ivoirienne', 'Excursion aux cascades de Man'],
    Lomé: ['Marché des féticheurs et artisanat', 'Plage et découverte du littoral', 'Saveurs du golfe de Guinée'],
    Cotonou: ['Route des pêches en pirogue', 'Ganvié, la cité lacustre', 'Marchés et tissus traditionnels'],
}

function Rating({ value, reviews }: { value: string; reviews: string }) {
    return <div className="mt-3 flex items-center gap-2 text-sm">
        <span className="flex gap-0.5 text-amber-500">
            {Array.from({ length: 5 }).map((_, index) => 
              <Star key={index} className="h-3.5 w-3.5 fill-current" />)}
            </span>
            <strong>{value}</strong>
            <span className="text-slate-400">({reviews})</span>
        </div>
}

export default function Reservation() {
    const [activeDestination, setActiveDestination] = useState<keyof typeof destinations>('Dakar')

    return (
        <main className="min-h-screen bg-[#f5fbf7] text-slate-900">
            <TravelBanner />
            <section className="relative overflow-hidden bg-gradient-to-b from-[#fbf7ef] via-[#eff8f2] to-[#f5fbf7] px-4 pb-14 pt-10 sm:px-6 lg:px-12">
                <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
                    <div className="mt-9 flex w-full max-w-5xl flex-col gap-2 rounded-3xl bg-white p-3 text-left shadow-xl sm:flex-row sm:items-center sm:rounded-full">
                        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-4 py-2 hover:bg-slate-50 sm:rounded-full">
                            <MapPin className="h-5 w-5 shrink-0 text-emerald-600" />
                            <span className="min-w-0"><span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Destination</span>
                                <input className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-500" placeholder="Où souhaitez-vous aller ?" /></span>
                        </label>
                        <div className="hidden h-8 w-px bg-slate-200 sm:block" />
                        <button className="flex items-center gap-3 rounded-2xl px-4 py-2 text-left hover:bg-slate-50 sm:rounded-full">
                            <CalendarDays className="h-5 w-5 text-slate-400" />
                            <span>
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Quand ?</span>
                                <span className="text-sm font-semibold">Toutes dates</span>
                            </span>
                        </button>
                        <div className="hidden h-8 w-px bg-slate-200 sm:block" />
                        <button className="flex items-center gap-3 rounded-2xl px-4 py-2 text-left hover:bg-slate-50 sm:rounded-full">
                            <Sparkles className="h-5 w-5 text-slate-400" />
                            <span>
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Type d’activité</span>
                                <span className="text-sm font-semibold">Toutes catégories</span>
                            </span>
                        </button>
                        <Button className="h-12 rounded-full bg-emerald-700 px-7 hover:bg-emerald-800">
                            <Search className="mr-2 h-4 w-4" />Rechercher</Button>
                    </div>

                    <div className="mt-9 grid w-full max-w-5xl gap-3 text-left md:grid-cols-3">
                        {[['Annulation gratuite', 'Jusqu’à 24h avant pour la majorité', Clock3], ['Avis de voyageurs vérifiés', 'Des expériences réellement vécues', Star], ['Meilleur prix garanti', 'Des offres claires, sans surprise', Check]].map(([title, detail, Icon]) => <div key={title as string} className="flex items-center gap-3 rounded-2xl bg-white/80 p-4 shadow-sm">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                                <Icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">{title as string}</p>
                                <p className="text-xs text-slate-500">{detail as string}</p>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-12">
                <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Inspirations</p>
                        <h2 className="mt-1 text-3xl font-bold tracking-tight">Explorer par catégorie</h2>
                    </div>
                    <p className="hidden max-w-sm text-right text-sm text-slate-500 md:block">Trouvez l’expérience qui correspond à votre rythme.</p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{categories.map(({ label, detail, icon: Icon, color }) => <Link key={label} href="/pages/reservation" className="group rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    <div className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${color}`}>
                        <Icon className="h-7 w-7" />
                    </div>
                    <p className="mt-3 text-sm font-bold group-hover:text-emerald-700">{label}</p>
                    <p className="mt-1 text-xs text-slate-400">{detail}</p>
                </Link>)}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-12">
                <div className="mb-7 flex items-end justify-between gap-4">
                    <div>
                        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                            <Sparkles className="h-4 w-4" /> Sélection officielle
                        </p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight">Expériences incontournables</h2>
                        <p className="mt-2 text-sm text-slate-500">Les activités les plus appréciées par notre communauté.</p>
                    </div>
                    <Button variant="outline" className="hidden rounded-full sm:flex">
                        Tout découvrir <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                    {experiences.map((experience) => <Card key={experience.title} className="group overflow-hidden border-0 bg-white py-0 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                        <div className="relative aspect-[4/3] overflow-hidden">
                            <img src={experience.image} alt={experience.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                            <span className="absolute left-3 top-3 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-bold text-white">{experience.tag}</span>
                            <button aria-label="Ajouter aux favoris" className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-slate-600">
                                <Heart className="h-4 w-4" />
                            </button>
                            <span className="absolute bottom-3 left-3 rounded-md bg-white/90 px-2 py-1 text-xs font-bold text-emerald-800">Annulation gratuite</span>
                        </div>
                        <CardContent className="p-5">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{experience.city}</p>
                            <h3 className="mt-1 line-clamp-2 font-semibold leading-6">{experience.title}</h3>
                            <Rating value={experience.rating} reviews={experience.reviews} />
                            <div className="mt-5 flex items-end justify-between border-t pt-4">
                                <span className="text-xs text-slate-400">Guide local · 2h30</span>
                                <span className="text-right">
                                    <small className="block text-xs text-slate-400">dès</small>
                                    <strong>{experience.price}</strong>
                                </span>
                            </div>
                        </CardContent>
                    </Card>)}
                </div>
            </section>

            <section className="mt-8 bg-white px-4 py-14 sm:px-6 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Villes phares</p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight">Les incontournables des destinations tendance</h2>
                        </div>
                        <p className="max-w-sm text-sm text-slate-500">Découvrez les expériences à vivre absolument dans chaque ville.</p>
                    </div>
                    <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
                        {(Object.keys(destinations) as Array<keyof typeof destinations>).map((destination) => <button key={destination} onClick={() => setActiveDestination(destination)} className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ${activeDestination === destination ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-emerald-100'}`}>
                            {destination}
                        </button>)
                        }</div>
                    <div className="mt-5 grid gap-4 md:grid-cols-3">{destinations[activeDestination].map((item, index) => <Link href="/pages/reservation" key={item} className="group rounded-2xl bg-[#f5fbf7] p-6 transition hover:bg-emerald-50">
                        <div className="flex items-start justify-between">
                            <div className="grid h-11 w-11 place-items-center rounded-xl bg-white text-emerald-700 shadow-sm">
                                <Compass className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-400">
                                {index + 1}2 expériences <ChevronRight className="inline h-3 w-3" />
                            </span>
                        </div>
                        <h3 className="mt-8 font-bold group-hover:text-emerald-700">{item}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500">Une expérience authentique accompagnée par des passionnés de la destination.</p>
                    </Link>)}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-12">
                <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-7 py-10 text-white shadow-2xl sm:px-12 lg:flex lg:items-center lg:justify-between lg:px-16">
                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1.5 text-xs font-bold text-amber-200">
                            <Sparkles className="h-4 w-4" /> BestRev Choice 2026</div>
                        <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">Des souvenirs qui valent le détour</h2>
                        <p className="mt-4 leading-7 text-slate-300">
                            Notre communauté sélectionne les expériences qui rendent chaque voyage vraiment inoubliable.
                        </p>
                        <div className="mt-8 grid grid-cols-3 gap-5 border-t border-white/10 pt-6">
                            <div>
                                <strong className="text-2xl text-amber-300">Top 1%</strong>
                                <span className="mt-1 block text-xs text-slate-400">d’expériences locales</span></div>
                            <div>
                                <strong className="text-2xl">4,9 / 5</strong>
                                <span className="mt-1 block text-xs text-slate-400">satisfaction moyenne</span>
                            </div>
                            <div>
                                <strong className="text-2xl text-emerald-300">100%</strong>
                                <span className="mt-1 block text-xs text-slate-400">guides vérifiés</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative z-10 mt-8 rounded-2xl bg-white p-5 text-slate-900 lg:mt-0 lg:w-80">
                        <div className="flex items-center gap-3">
                            <div className="grid h-11 w-11 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">À découvrir</p><p className="font-bold">Les trésors près de chez vous</p>
                            </div>
                        </div>
                        <Button asChild className="mt-5 w-full rounded-full bg-emerald-700 hover:bg-emerald-800">
                            <Link href="/pages/reservation">
                                Explorer les activités <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                    <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-emerald-700/30 blur-3xl" />
                </div>
            </section>
        </main>
    )
}