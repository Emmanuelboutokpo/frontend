'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Save, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AuthDialog from '@/components/front-office/AuthDialog'
import { useAuthStore } from '@/store'
 
export default function ProfilePage() {
    const { isAuthenticated, email, firstName, lastName, avatar, updateProfile } = useAuthStore()
    const [authOpen, setAuthOpen] = useState(false)
    const [form, setForm] = useState({ email: email ?? '', firstName: firstName ?? '', lastName: lastName ?? '' })
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        if (!isAuthenticated) setAuthOpen(true)
    }, [isAuthenticated])

    useEffect(() => {
        setForm({ email: email ?? '', firstName: firstName ?? '', lastName: lastName ?? '' })
    }, [email, firstName, lastName])

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        updateProfile(form)
        setSaved(true)
    }

    return <main className="min-h-screen bg-[#f5fbf7] px-4 py-8 text-slate-900 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-3xl">
            <Link href="/pages/front-office" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700"><ArrowLeft className="h-4 w-4" />Retour à l&apos;accueil</Link>
            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-6">{avatar ? <img src={avatar} alt="Photo de profil" className="h-12 w-12 rounded-full object-cover" /> : <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-100 font-bold text-emerald-700">{`${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || <UserRound className="h-5 w-5" />}</span>}<div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Mon compte</p><h1 className="mt-1 text-3xl font-bold">Informations personnelles</h1><p className="mt-1 text-sm text-slate-500">Gérez les informations associées à votre compte.</p></div></div>
                {!isAuthenticated ? <p className="py-12 text-center text-slate-500">Connectez-vous pour modifier vos informations.</p> : <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold">Prénom<input value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-emerald-500" required /></label><label className="text-sm font-semibold">Nom<input value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-emerald-500" required /></label></div>
                    <label className="block text-sm font-semibold">Adresse email<span className="mt-2 flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-emerald-500"><Mail className="h-4 w-4 text-slate-400" /><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="min-w-0 flex-1 outline-none" required /></span></label>
                    <div className="flex flex-col items-start justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center"><p className="text-sm text-emerald-700">{saved ? 'Informations enregistrées.' : 'Vos informations sont sauvegardées localement.'}</p><Button type="submit" className="rounded-xl bg-emerald-700 hover:bg-emerald-800"><Save className="mr-2 h-4 w-4" />Enregistrer</Button></div>
                </form>}
            </div>
        </div>
        <AuthDialog open={authOpen} onOpenChange={setAuthOpen} title="Connectez-vous pour modifier votre profil" />
    </main>
}
