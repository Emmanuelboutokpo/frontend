'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
    ArrowLeft,
    BedDouble,
    CalendarDays,
    Check,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Heart,
    LocateFixed,
    Mail,
    MapPin,
    Maximize2,
    Phone,
    Play,
    ShieldCheck,
    Star,
    Users,
    Wifi,
    X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AuthDialog from '@/components/front-office/AuthDialog'
import { usePropertyStore } from '../../../store'
import { useAuthStore } from '../../../store/authStore'

type PropertyDetailProps = { slug: string }

const amenityIcons: Record<string, typeof Wifi> = {
    wifi: Wifi,
    securite: ShieldCheck,
    parking: MapPin,
    climatisation: Check,
    piscine: Check,
    default: Check,
}

function RatingStars({ value }: { value: number }) {
    return <span className="flex items-center gap-0.5 text-amber-500">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className={`h-4 w-4 ${index < Math.round(value) ? 'fill-current' : ''}`} />)}</span>
}

export default function PropertyDetail({ slug }: PropertyDetailProps) {
    const data = usePropertyStore((state) => state.data)
    const favoriteIds = usePropertyStore((state) => state.favoriteIds)
    const toggleFavorite = usePropertyStore((state) => state.toggleFavorite)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const [galleryOpen, setGalleryOpen] = useState(false)
    const [activePhoto, setActivePhoto] = useState(0)
    const [authOpen, setAuthOpen] = useState(false)
    const [pendingAction, setPendingAction] = useState<'favorite' | 'reserve' | null>(null)
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [guests, setGuests] = useState(1)
    const [calendarTarget, setCalendarTarget] = useState<'checkIn' | 'checkOut' | null>(null)
    const property = data.Establishments.find((item) => item.slug === slug)

    if (!property) {
        return <main className="mx-auto max-w-3xl px-4 py-24 text-center"><h1 className="text-2xl font-bold">Établissement introuvable</h1><Button asChild className="mt-6 rounded-full bg-emerald-700"><Link href="/pages/front-office">Retour à l’accueil</Link></Button></main>
    }

    const country = data.Countries.find((item) => item.id === property.country_id)
    const category = data.Categories.find((item) => item.id === property.category_id)
    const subcategory = data.SubCategories.find((item) => item.id === property.subcategory_id)
    const owner = data.Owners.find((item) => item.id === property.owner_id)
    const department = data.Departments.find((item) => item.id === property.department_id)
    const commune = data.Communes.find((item) => item.id === property.commune_id)
    const locality = data.Localities.find((item) => item.id === property.locality_id)
    const photos = data.Photos.filter((photo) => property.photo_ids.includes(photo.id))
    const videos = data.Videos.filter((video) => property.video_ids.includes(video.id))
    const reviews = data.Reviews.filter((review) => property.review_ids.includes(review.id))
    const amenities = data.Amenities.filter((amenity) => property.amenity_ids.includes(amenity.id))
    const favorite = favoriteIds.includes(property.id)
    const currentPhoto = photos[activePhoto]
    const nights = checkIn && checkOut ? Math.max(0, Math.ceil((new Date(`${checkOut}T00:00:00`).getTime() - new Date(`${checkIn}T00:00:00`).getTime()) / 86400000)) : 0
    const totalAmount = property.price_per_night ? property.price_per_night * nights : 0
    const reservationParams = new URLSearchParams({ checkIn, checkOut, guests: String(guests) })
    const selectedCalendarDate = calendarTarget === 'checkIn' ? checkIn : checkOut
    const calendarDate = selectedCalendarDate ? new Date(`${selectedCalendarDate}T00:00:00`) : undefined
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const calendarMinimum = calendarTarget === 'checkOut' && checkIn ? new Date(`${checkIn}T00:00:00`) : today
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${property.lng - 0.025}%2C${property.lat - 0.02}%2C${property.lng + 0.025}%2C${property.lat + 0.02}&layer=mapnik&marker=${property.lat}%2C${property.lng}`
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${property.lat},${property.lng}`

    return (
        <main className="min-h-screen bg-[#f5fbf7] pb-20 text-slate-900">
            <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-12">
                <div className="flex items-center justify-between gap-4">
                    <Link href="/pages/front-office" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-700"><ArrowLeft className="h-4 w-4" />Retour aux établissements</Link>
                    <Button type="button" variant="outline" size="icon" aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'} onClick={() => { if (isAuthenticated) toggleFavorite(property.id); else { setPendingAction('favorite'); setAuthOpen(true) } }} className={`rounded-full bg-white ${favorite ? 'text-rose-500' : 'text-slate-600'}`}><Heart className={favorite ? 'fill-current' : ''} /></Button>
                </div>

                <header className="mt-6 flex flex-col gap-5 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">{category?.name}{subcategory ? ` · ${subcategory.name}` : ''}</p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">{property.name}</h1>
                        <p className="mt-3 flex items-center gap-2 text-sm text-slate-500"><MapPin className="h-4 w-4 text-emerald-700" />{property.address} · {country?.name}</p>
                    </div>
                    <div className="flex items-center gap-3 text-sm"><RatingStars value={property.rating} /><strong>{property.rating.toFixed(1)}</strong><span className="text-slate-400">({reviews.length} avis)</span></div>
                </header>

                <section className="mt-6" aria-label="Galerie photos">
                    {photos.length > 0 ? <div className="relative grid gap-2 overflow-hidden rounded-2xl sm:grid-cols-2 sm:grid-rows-2 lg:h-[30rem] lg:grid-cols-[1.15fr_0.85fr]">
                        <button type="button" onClick={() => { setActivePhoto(0); setGalleryOpen(true) }} className="group relative h-72 overflow-hidden bg-slate-100 text-left sm:row-span-2 sm:h-full lg:min-h-[30rem]">
                            <img src={photos[0].url} alt={property.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                            <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs font-bold text-slate-800 shadow-sm"><Maximize2 className="h-3.5 w-3.5" />Voir la galerie</span>
                        </button>
                        <div className="grid grid-cols-2 gap-2 sm:contents">
                            {photos.slice(1, 5).map((photo, index) => <button type="button" key={photo.id} onClick={() => { setActivePhoto(index + 1); setGalleryOpen(true) }} className="group relative h-36 overflow-hidden bg-slate-100 text-left sm:h-full">
                                <img src={photo.url} alt={`${property.name} ${index + 2}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                                {index === 3 && photos.length > 5 && <span className="absolute inset-0 grid place-items-center bg-slate-950/55 text-sm font-bold text-white">+{photos.length - 5} photos</span>}
                            </button>)}
                        </div>
                        <Button type="button" variant="outline" onClick={() => { setActivePhoto(0); setGalleryOpen(true) }} className="absolute bottom-4 right-4 rounded-full border-slate-300 bg-white/95 text-xs font-bold shadow-sm hover:bg-white"><Maximize2 className="mr-2 h-3.5 w-3.5" />Afficher toutes les photos</Button>
                    </div> : <div className="grid h-72 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><MapPin className="h-10 w-10" /></div>}
                </section>

                <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
                    <div className="space-y-10">
                        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <InfoItem icon={Users} label="Capacité" value={`${property.max_guests} voyageurs`} />
                            <InfoItem icon={BedDouble} label="Couchages" value={`${property.beds} lit${property.beds > 1 ? 's' : ''}`} />
                            <InfoItem icon={Maximize2} label="Surface" value={`${property.area} m²`} />
                            <InfoItem icon={CalendarDays} label="Disponibilité" value={property.availability_status === 'AVAILABLE' ? 'Disponible' : 'Indisponible'} />
                        </section>

                        <section className="border-t border-slate-200 pt-8"><h2 className="text-2xl font-bold">À propos de l’établissement</h2><p className="mt-4 max-w-3xl whitespace-pre-line text-[15px] leading-7 text-slate-600">{property.description}</p></section>

                        {amenities.length > 0 && <section className="border-t border-slate-200 pt-8"><h2 className="text-2xl font-bold">Équipements et services</h2><div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">{amenities.map((amenity) => { const Icon = amenityIcons[amenity.slug] ?? amenityIcons.default; return <div key={amenity.id} className="flex items-center gap-3 text-sm text-slate-700"><span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Icon className="h-4 w-4" /></span>{amenity.name}</div> })}</div></section>}

                        <section className="border-t border-slate-200 pt-8"><h2 className="text-2xl font-bold">Informations pratiques</h2><div className="mt-5 grid gap-4 text-sm text-slate-600 sm:grid-cols-2"><DetailRow label="Horaires" value={property.opening_hours ?? 'Sur réservation'} /><DetailRow label="Nombre de salles de bain" value={String(property.bathrooms)} /><DetailRow label="Publié le" value={new Date(property.published_at).toLocaleDateString('fr-FR')} /><DetailRow label="Dernière mise à jour" value={new Date(property.updated_at).toLocaleDateString('fr-FR')} /></div></section>

                        <section className="border-t border-slate-200 pt-8" aria-labelledby="location-title">
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Emplacement</p>
                                    <h2 id="location-title" className="mt-1 text-2xl font-bold">Où se trouve l’établissement ?</h2>
                                </div>
                                <Button asChild variant="outline" className="w-fit rounded-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                                    <a href={directionsUrl} target="_blank" rel="noreferrer">
                                        <LocateFixed className="mr-2 h-4 w-4" />
                                        Itinéraire
                                        <ExternalLink className="ml-2 h-3.5 w-3.5" />
                                    </a>
                                </Button>
                            </div>
                            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <iframe title={`Carte de ${property.name}`} src={mapUrl} className="h-72 w-full border-0 sm:h-96" loading="lazy" />
                            </div>
                        </section>
                        {reviews.length > 0 &&
                            <section className="border-t border-slate-200 pt-8">
                                <div className="flex items-end justify-between"><div>
                                    <h2 className="text-2xl font-bold">Avis des voyageurs</h2>
                                    <div className="mt-2 flex items-center gap-2">
                                        <RatingStars value={property.rating} />
                                        <strong>{property.rating.toFixed(1)} / 5</strong>
                                    </div>
                                </div>
                                    <span className="text-sm text-slate-500">{reviews.length} avis</span>
                                </div>
                                <div className="mt-5 grid gap-4 sm:grid-cols-2">{reviews.map((review) =>
                                    <article key={review.id} className="rounded-xl border border-slate-200 bg-white p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <strong className="text-sm">{review.author_name}</strong>
                                            <span className="text-xs text-slate-400">
                                                {new Date(review.created_at).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                        <RatingStars value={review.rating} />
                                        <p className="mt-3 text-sm leading-6 text-slate-600">
                                            {review.comment}
                                        </p>
                                    </article>)}
                                </div>
                            </section>}
                    </div>

                    <aside className="h-fit lg:sticky lg:top-24">
 
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Votre séjour</p>
                            <p className="mt-2 text-2xl font-bold">{property.price_per_night ? `${property.price_per_night.toLocaleString('fr-FR')} ${property.currency}` : 'Tarif sur demande'}</p>
                            {property.price_per_night && <p className="text-sm text-slate-500">par nuit</p>}
                            <div className="mt-5 overflow-hidden rounded-xl border border-slate-300">
                                <div className="grid grid-cols-2 divide-x divide-slate-200">
                                    <button type="button" onClick={() => setCalendarTarget('checkIn')} className="p-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 transition hover:bg-slate-50">Arrivée<span className="mt-1 block text-sm font-semibold normal-case tracking-normal text-slate-800">{checkIn ? new Date(`${checkIn}T00:00:00`).toLocaleDateString('fr-FR') : 'Ajouter une date'}</span></button>
                                    <button type="button" onClick={() => setCalendarTarget('checkOut')} className="p-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 transition hover:bg-slate-50">Départ<span className="mt-1 block text-sm font-semibold normal-case tracking-normal text-slate-800">{checkOut ? new Date(`${checkOut}T00:00:00`).toLocaleDateString('fr-FR') : 'Ajouter une date'}</span></button>
                                </div>
                                <div className="border-t border-slate-200 p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Voyageurs</p><Select value={String(guests)} onValueChange={(value) => setGuests(Number(value))}><SelectTrigger className="mt-1 h-auto w-full border-0 bg-transparent px-0 text-sm font-semibold shadow-none focus:ring-0"><SelectValue /></SelectTrigger><SelectContent>{Array.from({ length: Math.max(1, property.max_guests) }, (_, index) => <SelectItem key={index + 1} value={String(index + 1)}>{index + 1} voyageur{index > 0 ? 's' : ''}</SelectItem>)}</SelectContent></Select></div>
                            </div>
                            <div className="mt-5 space-y-3 text-sm"><div className="flex justify-between border-t pt-3 text-base font-bold"><span>Total</span><span>{totalAmount ? `${totalAmount.toLocaleString('fr-FR')} ${property.currency}` : 0}</span></div></div>
                            <Button asChild disabled={!checkIn || !checkOut || nights < 1 || property.availability_status !== 'AVAILABLE'} className="mt-5 h-12 w-full rounded-xl bg-emerald-700 font-semibold hover:bg-emerald-800"><Link href={`/pages/front-office/reservation/${property.id}?${reservationParams.toString()}`}><CalendarDays className="mr-2 h-4 w-4" />Réserver</Link></Button>
                            <p className="mt-3 text-center text-xs text-slate-400">Choisissez vos dates pour afficher le total.</p>
                        </div>
                    </aside>
                </div>
            </div>

            <Dialog open={calendarTarget !== null} onOpenChange={(open) => { if (!open) setCalendarTarget(null) }}>
                <DialogContent className="w-fit max-w-[calc(100%-2rem)] rounded-2xl p-2 sm:p-4">
                    <DialogTitle>{calendarTarget === 'checkIn' ? 'Date d’arrivée' : 'Date de départ'}</DialogTitle>
                    <Calendar mode="single" selected={calendarDate} onSelect={(date) => { if (!date) return; const value = date.toISOString().slice(0, 10); if (calendarTarget === 'checkIn') { setCheckIn(value); if (checkOut && date >= new Date(`${checkOut}T00:00:00`)) setCheckOut('') } else setCheckOut(value); setCalendarTarget(null) }} disabled={{ before: calendarMinimum }} />
                </DialogContent>
            </Dialog>

            <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
                <DialogContent className="max-w-6xl border-0 bg-slate-950 p-2 text-white sm:p-4">
                    <DialogTitle className="sr-only">Galerie de {property.name}</DialogTitle>
                    <div className="relative">
                        <img src={currentPhoto?.url} alt={property.name} className="max-h-[82vh] w-full rounded-lg object-contain" />
                        <Button type="button" variant="ghost" size="icon" aria-label="Fermer la galerie" onClick={() => setGalleryOpen(false)} className="absolute right-2 top-2 rounded-full bg-black/50 text-white hover:bg-black/70"><X /></Button>
                        {photos.length > 1 && <div className="contents">
                            <Button type="button" variant="ghost" size="icon" aria-label="Photo précédente" onClick={() => setActivePhoto((index) => (index - 1 + photos.length) % photos.length)} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"><ChevronLeft /></Button>
                            <Button type="button" variant="ghost" size="icon" aria-label="Photo suivante" onClick={() => setActivePhoto((index) => (index + 1) % photos.length)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"><ChevronRight /></Button>
                        </div>}
                    </div>
                </DialogContent>
            </Dialog>
            <AuthDialog open={authOpen} onOpenChange={(open) => { setAuthOpen(open); if (!open) setPendingAction(null) }} onAuthenticated={() => { if (pendingAction === 'favorite') toggleFavorite(property.id); if (pendingAction === 'reserve') window.location.href = `/pages/front-office/reservation/${property.id}`; setPendingAction(null) }} title="Connectez-vous pour continuer" />
        </main>
    )
}

function InfoItem({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
    return <div className="rounded-xl border border-slate-200 bg-white p-3"><Icon className="h-5 w-5 text-emerald-700" /><p className="mt-3 text-xs text-slate-400">{label}</p><p className="mt-1 text-sm font-bold text-slate-800">{value}</p></div>
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return <div className="rounded-xl bg-white p-4"><p className="text-xs text-slate-400">{label}</p><p className="mt-1 font-semibold text-slate-800">{value}</p></div>
}
