'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { ArrowLeft, CalendarDays, CheckCircle2, CreditCard, LockKeyhole, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PaymentProvider, useAuthStore, useBookingStore, usePropertyStore } from '@/store'
 

const formatMoney = (value: number, currency: string) => `${value.toLocaleString('fr-FR')} ${currency}`

export default function ReservationPage() {
    const params = useParams<{ establishmentId: string }>()
    const searchParams = useSearchParams()
    const data = usePropertyStore((state) => state.data)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const property = data.Establishments.find((item) => item.id === Number(params.establishmentId))
    const addBooking = useBookingStore((state) => state.addBooking)
    const [provider, setProvider] = useState<PaymentProvider>('fedapay')
    const [paymentMessage, setPaymentMessage] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const checkIn = searchParams.get('checkIn') ?? ''
    const checkOut = searchParams.get('checkOut') ?? ''
    const guests = Number(searchParams.get('guests') ?? 1)
    const nights = useMemo(() => checkIn && checkOut ? Math.max(0, Math.ceil((new Date(`${checkOut}T00:00:00`).getTime() - new Date(`${checkIn}T00:00:00`).getTime()) / 86400000)) : 0, [checkIn, checkOut])

    if (!property) return <main className="mx-auto max-w-3xl px-4 py-24 text-center"><h1 className="text-2xl font-bold">Réservation introuvable</h1><Button asChild className="mt-6 rounded-full bg-emerald-700"><Link href="/pages/front-office">Retour à l’accueil</Link></Button></main>
    if (!isAuthenticated) return <main className="mx-auto max-w-3xl px-4 py-24 text-center"><LockKeyhole className="mx-auto h-10 w-10 text-emerald-700" /><h1 className="mt-5 text-2xl font-bold">Connectez-vous pour réserver</h1><p className="mt-3 text-slate-500">Votre réservation sera associée à votre compte.</p><Button asChild className="mt-6 rounded-full bg-emerald-700"><Link href={`/pages/front-office/${property.category_id === 2 ? 'restaurant' : property.category_id === 3 ? 'loisir' : 'hebergement'}/${property.slug}`}>Retour à l’établissement</Link></Button></main>

    const amount = property.price_per_night && nights ? property.price_per_night * nights : 0
    const owner = data.Owners.find((item) => item.id === property.owner_id)
    const whatsappPhone = owner?.phone?.replace(/\D/g, '')

    const handlePaymentStart = () => {
        if (!checkIn || !checkOut || nights < 1 || !amount) {
            setPaymentMessage('Sélectionnez des dates valides pour continuer.')
            return
        }
        addBooking({ propertyId: property.id, propertyName: property.name, propertyAddress: property.address, checkIn, checkOut, guests, nights, amount, currency: property.currency, paymentProvider: provider, status: 'pending' })
        setSubmitted(true)
        setPaymentMessage(`Le parcours ${provider === 'fedapay' ? 'FedaPay' : 'KKPay'} est prêt. Les clés de paiement doivent être configurées pour ouvrir la page sécurisée du fournisseur.`)
    }

    return <main className="min-h-screen bg-[#f5fbf7] pb-20 text-slate-900"><div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-12">
        <Link href={`/pages/front-office/${property.category_id === 2 ? 'restaurant' : property.category_id === 3 ? 'loisir' : 'hebergement'}/${property.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700"><ArrowLeft className="h-4 w-4" />Retour à l’établissement</Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_24rem]"><section><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Finaliser votre séjour</p><h1 className="mt-2 text-4xl font-bold tracking-tight">Réserver {property.name}</h1><p className="mt-3 text-slate-500">Un récapitulatif clair avant le paiement.</p>
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-xl font-bold">Votre séjour</h2><div className="mt-5 grid gap-4 sm:grid-cols-3"><Summary icon={CalendarDays} label="Arrivée" value={checkIn || 'Non définie'} /><Summary icon={CalendarDays} label="Départ" value={checkOut || 'Non définie'} /><Summary icon={Users} label="Voyageurs" value={String(guests)} /></div></div>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-xl font-bold">Mode de paiement</h2><div className="mt-5 grid gap-3 sm:grid-cols-2"><PaymentChoice active={provider === 'fedapay'} onClick={() => setProvider('fedapay')} title="FedaPay" detail="Mobile money et cartes" /><PaymentChoice active={provider === 'kkpays'} onClick={() => setProvider('kkpays')} title="KKPay" detail="Paiement local sécurisé" /></div><p className="mt-4 flex items-center gap-2 text-xs text-slate-500"><LockKeyhole className="h-4 w-4 text-emerald-700" />Le paiement sera traité sur la page sécurisée du fournisseur.</p></div>
            {submitted && <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5"><p className="flex items-center gap-2 font-semibold text-amber-900"><CheckCircle2 className="h-5 w-5" />Réservation enregistrée en attente de paiement</p><p className="mt-2 text-sm leading-6 text-amber-800">{paymentMessage}</p>{whatsappPhone && <a href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(`Bonjour, je souhaite confirmer ma réservation pour ${property.name}.`)}`} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-bold text-emerald-800 underline">Contacter le promoteur sur WhatsApp</a>}</div>}
        </section><aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24"><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Détail du prix</p><div className="mt-5 space-y-4 text-sm"><div className="flex justify-between"><span>{formatMoney(property.price_per_night ?? 0, property.currency)} × {nights} nuit{nights > 1 ? 's' : ''}</span><strong>{formatMoney(amount, property.currency)}</strong></div><div className="border-t pt-4"><div className="flex justify-between text-lg font-bold"><span>Total</span><span>{formatMoney(amount, property.currency)}</span></div></div></div><Button type="button" onClick={handlePaymentStart} disabled={!amount || submitted} className="mt-7 h-12 w-full rounded-xl bg-emerald-700 font-semibold hover:bg-emerald-800"><CreditCard className="mr-2 h-4 w-4" />{submitted ? 'Réservation en attente' : `Payer avec ${provider === 'fedapay' ? 'FedaPay' : 'KKPay'}`}</Button>{paymentMessage && !submitted && <p className="mt-3 text-sm font-medium text-red-600">{paymentMessage}</p>}</aside></div>
    </div></main>
}

function Summary({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) { return <div className="rounded-xl bg-emerald-50 p-4"><Icon className="h-5 w-5 text-emerald-700" /><p className="mt-3 text-xs text-slate-500">{label}</p><p className="mt-1 font-bold text-slate-800">{value}</p></div> }
function PaymentChoice({ active, onClick, title, detail }: { active: boolean; onClick: () => void; title: string; detail: string }) { return <button type="button" onClick={onClick} className={`rounded-xl border p-4 text-left transition ${active ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-emerald-300'}`}><span className="font-bold">{title}</span><span className="mt-1 block text-xs text-slate-500">{detail}</span></button> }
