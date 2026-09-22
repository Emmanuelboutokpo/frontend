'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Autoplay from 'embla-carousel-autoplay'
import {
    CalendarDays,
    MapPin,
    Search,
    Sparkles,
} from 'lucide-react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'

const slides = [
    {
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85',
    },
    {
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=85',
    },
    {
        image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=2000&q=85',
    },
]

export function TravelBanner() {
    const router = useRouter()
    const [destination, setDestination] = useState('')

    const handleSearch = () => {
        if (destination.trim()) {
            router.push(`/pages/front-office/explorer?keyword=${encodeURIComponent(destination.trim())}`)
        } else {
            router.push('/pages/front-office/explorer')
        }
    }

    return (
        <section className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-12" aria-label="Inspirations de voyage">
            <Carousel
                opts={{ loop: true }}
                plugins={[Autoplay({ delay: 5500, stopOnInteraction: true })]}
                className="group"
            >
                <CarouselContent className="-ml-0">
                    {slides.map((slide) => (
                        <CarouselItem key={slide.image} className="pl-0">
                            <article
                                className="relative flex min-h-[760px] flex-col justify-center gap-6 overflow-hidden rounded-[1rem] bg-slate-900 bg-cover bg-center px-6 py-8 text-white sm:min-h-[680px] sm:px-12 sm:py-12 lg:min-h-[620px] lg:px-16"
                                style={{ backgroundImage: `url(${slide.image})` }}
                            >
                                <div className="relative z-10 mx-auto w-full max-w-5xl text-slate-900" aria-label="Rechercher une expérience">
                                    <div className="flex w-full flex-col gap-2 rounded-3xl bg-white p-3 text-left shadow-xl sm:flex-row sm:items-center sm:rounded-full">
                                        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-4 py-2 hover:bg-slate-50 sm:rounded-full">
                                            <MapPin className="h-5 w-5 shrink-0 text-emerald-600" />
                                            <span className="min-w-0">
                                                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                    Destination
                                                </span>
                                                <input
                                                    value={destination}
                                                    onChange={(e) => setDestination(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                                                    Type d’activité
                                                </span>
                                                <span className="text-sm font-semibold">Toutes catégories</span>
                                            </span>
                                        </Link>
                                        <Button
                                            onClick={handleSearch}
                                            className="h-12 rounded-full bg-emerald-700 px-7 hover:bg-emerald-800"
                                        >
                                            <Search className="mr-2 h-4 w-4" />
                                            Rechercher
                                        </Button>
                                    </div>
                                </div>
                            </article>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 border-white/30 bg-black/25 text-white hover:bg-white hover:text-slate-900 sm:left-6" />
                <CarouselNext className="right-4 border-white/30 bg-black/25 text-white hover:bg-white hover:text-slate-900 sm:right-6" />
            </Carousel>
        </section>
    )
}