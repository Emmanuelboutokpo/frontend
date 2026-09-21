 'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, Compass, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AuthDialog from '@/components/front-office/AuthDialog'
import { useAuthStore, useBookingStore } from '@/store'
 
 

export default function ReservationsPage() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
	const [authOpen, setAuthOpen] = useState(false)
	const bookings = useBookingStore((state) => state.bookings)

	useEffect(() => {
		if (!isAuthenticated) setAuthOpen(true)
	}, [isAuthenticated])

	return <main className="min-h-screen bg-[#f5fbf7] px-4 py-8 text-slate-900 sm:px-6 lg:px-12">
		<div className="mx-auto max-w-5xl">
			<Link href="/pages/front-office" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700"><ArrowLeft className="h-4 w-4" />Retour à l&apos;accueil</Link>
			<div className="mt-8 flex items-end justify-between gap-4 border-b border-slate-200 pb-7"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Mon compte</p><h1 className="mt-2 text-4xl font-bold">Mes réservations</h1><p className="mt-3 text-slate-600">Suivez vos séjours et retrouvez vos prochaines expériences.</p></div><CalendarDays className="hidden h-10 w-10 text-emerald-700 sm:block" /></div>
			{!isAuthenticated ? <p className="py-16 text-center text-slate-500">Connectez-vous pour accéder à vos réservations.</p> : bookings.length === 0 ? <div className="mt-12 rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm"><Compass className="mx-auto h-10 w-10 text-emerald-600" /><h2 className="mt-5 text-2xl font-bold">Aucune réservation pour le moment</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">Explorez nos établissements et réservez l’adresse qui vous convient.</p><Button asChild className="mt-7 rounded-full bg-emerald-700 hover:bg-emerald-800"><Link href="/pages/front-office">Explorer les établissements</Link></Button></div> : <div className="mt-8 grid gap-4">{bookings.map((booking) => <article key={booking.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-xs font-bold uppercase tracking-wider text-emerald-700">{booking.status === 'paid' ? 'Confirmée' : booking.status === 'pending' ? 'En attente de paiement' : 'Annulée'}</p><h2 className="mt-1 text-xl font-bold">{booking.propertyName}</h2><p className="mt-2 flex items-center gap-1 text-sm text-slate-500"><MapPin className="h-4 w-4" />{booking.propertyAddress}</p></div><strong className="text-lg">{booking.amount.toLocaleString('fr-FR')} {booking.currency}</strong></div><div className="mt-5 grid gap-3 border-t pt-4 text-sm sm:grid-cols-3"><span><b className="block text-xs text-slate-400">Séjour</b>{booking.checkIn} → {booking.checkOut}</span><span><b className="block text-xs text-slate-400">Voyageurs</b>{booking.guests} · {booking.nights} nuit{booking.nights > 1 ? 's' : ''}</span><span><b className="block text-xs text-slate-400">Paiement</b>{booking.paymentProvider === 'fedapay' ? 'FedaPay' : booking.paymentProvider === 'kkpays' ? 'KKPay' : 'Non défini'}</span></div></article>)}</div>}
		</div>
		<AuthDialog open={authOpen} onOpenChange={setAuthOpen} title="Connectez-vous pour voir vos réservations" />
	</main>
}
