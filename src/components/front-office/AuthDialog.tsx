'use client'

import { FormEvent, useState } from 'react'
import { Facebook, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuthStore } from '@/store'
 
type AuthDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAuthenticated?: () => void
    title?: string
}

export default function AuthDialog({ open, onOpenChange, onAuthenticated, title = 'Connectez-vous pour continuer' }: AuthDialogProps) {
    const signIn = useAuthStore((state) => state.signIn)
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')

    const completeSignIn = (value: string) => {
        signIn(value)
        onOpenChange(false)
        onAuthenticated?.()
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!email.trim() || !email.includes('@')) {
            setError('Entrez une adresse email valide.')
            return
        }
        completeSignIn(email.trim())
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-2xl p-6 sm:max-w-md">
                <DialogHeader className="text-left">
                    <div className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-emerald-50 text-emerald-700"><LockKeyhole className="h-5 w-5" /></div>
                    <DialogTitle className="text-2xl">{title}</DialogTitle>
                    <DialogDescription>Créez une session pour enregistrer vos favoris et poursuivre votre réservation.</DialogDescription>
                </DialogHeader>

                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                    <Button type="button" variant="outline" onClick={() => completeSignIn('google-user@bestreserv.local')} className="h-11 rounded-xl border-slate-200"><span className="font-bold text-red-500">G</span> Google</Button>
                    <Button type="button" variant="outline" onClick={() => completeSignIn('facebook-user@bestreserv.local')} className="h-11 rounded-xl border-slate-200"><Facebook className="h-4 w-4 fill-[#1877F2] text-[#1877F2]" /> Facebook</Button>
                </div>

                <div className="my-4 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200" />ou avec votre email<span className="h-px flex-1 bg-slate-200" /></div>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700">Adresse email
                        <span className="mt-2 flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10"><Mail className="h-4 w-4 text-slate-400" /><input type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError('') }} placeholder="vous@exemple.com" className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none" /></span>
                    </label>
                    {error && <p className="text-xs font-medium text-red-600">{error}</p>}
                    <Button type="submit" className="h-11 w-full rounded-xl bg-emerald-700 font-semibold hover:bg-emerald-800">Continuer avec l&apos;email</Button>
                </form>
                <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-xs text-slate-400"><ShieldCheck className="h-3.5 w-3.5" />Vos données restent protégées.</p>
            </DialogContent>
        </Dialog>
    )
}
