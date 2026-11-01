'use client'

import { FormEvent, useState } from 'react'
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuthStore } from '@/store'

type AuthDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAuthenticated?: () => void
    title?: string
}

type AuthMode = 'login' | 'signup' | 'verify' | 'forgot' | 'reset'

const inputClassName = 'h-11 w-full rounded-xl border border-slate-200 bg-transparent px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10'

type PasswordFieldProps = {
    label: string
    value: string
    onChange: (value: string) => void
    autoComplete: string
    visible: boolean
    onToggleVisibility: () => void
}

function PasswordField({ label, value, onChange, autoComplete, visible, onToggleVisibility }: PasswordFieldProps) {
    return (
        <label className="block text-sm font-semibold text-slate-700">{label}
            <span className="relative mt-2 block">
                <input required minLength={8} maxLength={128} type={visible ? 'text' : 'password'} autoComplete={autoComplete} value={value} onChange={(event) => onChange(event.target.value)} className={`${inputClassName} pr-10`} />
                <button type="button" onClick={onToggleVisibility} aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} aria-pressed={visible} className="absolute inset-y-0 right-0 grid w-10 place-items-center text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50">
                    {visible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                </button>
            </span>
        </label>
    )
}

export default function AuthDialog({ open, onOpenChange, onAuthenticated, title = 'Connectez-vous pour continuer' }: AuthDialogProps) {
    const signIn = useAuthStore((state) => state.signIn)
    const signUp = useAuthStore((state) => state.signUp)
    const verifyOtp = useAuthStore((state) => state.verifyOtp)
    const resendOtp = useAuthStore((state) => state.resendOtp)
    const forgotPassword = useAuthStore((state) => state.forgotPassword)
    const resetPassword = useAuthStore((state) => state.resetPassword)
    const [mode, setMode] = useState<AuthMode>('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
    const [code, setCode] = useState('')
    const [token, setToken] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const changeMode = (nextMode: AuthMode) => {
        setMode(nextMode)
        setError('')
        setSuccess('')
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')
        setSuccess('')
        setIsSubmitting(true)

        try {
            if (mode === 'login') {
                await signIn(email.trim(), password)
                onOpenChange(false)
                onAuthenticated?.()
            } else if (mode === 'signup') {
                await signUp(email.trim(), password)
                changeMode('verify')
                setSuccess('Un code de vérification a été envoyé à votre adresse email.')
            } else if (mode === 'verify') {
                await verifyOtp(email.trim(), code.trim())
                changeMode('login')
                setSuccess('Votre compte est vérifié. Vous pouvez maintenant vous connecter.')
            } else if (mode === 'forgot') {
                await forgotPassword(email.trim())
                changeMode('reset')
                setSuccess('Si un compte correspond à cette adresse, un lien de réinitialisation lui a été envoyé.')
            } else {
                if (password !== confirmPassword) {
                    setError('Les mots de passe ne correspondent pas.')
                    return
                }
                await resetPassword(token.trim(), password, confirmPassword)
                changeMode('login')
                setPassword('')
                setConfirmPassword('')
                setSuccess('Votre mot de passe a été modifié. Vous pouvez vous connecter.')
            }
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'Une erreur est survenue. Veuillez réessayer.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleResendOtp = async () => {
        setError('')
        setSuccess('')
        setIsSubmitting(true)
        try {
            await resendOtp(email.trim())
            setSuccess('Un nouveau code de vérification a été envoyé.')
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'Impossible de renvoyer le code.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const heading = {
        login: title,
        signup: 'Créer un compte',
        verify: 'Vérifier votre adresse email',
        forgot: 'Mot de passe oublié',
        reset: 'Réinitialiser le mot de passe',
    }[mode]
    const description = {
        login: 'Connectez-vous pour enregistrer vos favoris et poursuivre votre réservation.',
        signup: 'Créez votre compte BestReserv avec votre adresse email.',
        verify: `Saisissez le code reçu par email à ${email}.`,
        forgot: 'Indiquez votre adresse email pour recevoir un lien de réinitialisation.',
        reset: 'Saisissez le jeton reçu par email et choisissez un nouveau mot de passe.',
    }[mode]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-2xl p-6 sm:max-w-md">
                <DialogHeader className="text-left">
                    <div className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-emerald-50 text-emerald-700"><LockKeyhole className="h-5 w-5" /></div>
                    <DialogTitle className="text-2xl">{heading}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-2 space-y-3">
                    {(mode === 'login' || mode === 'signup' || mode === 'forgot') && (
                        <label className="block text-sm font-semibold text-slate-700">Adresse email
                            <span className="mt-2 flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10"><Mail className="h-4 w-4 text-slate-400" /><input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vous@exemple.com" className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none" /></span>
                        </label>
                    )}

                    {(mode === 'login' || mode === 'signup') && (
                        <PasswordField
                            label="Mot de passe"
                            value={password}
                            onChange={setPassword}
                            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                            visible={isPasswordVisible}
                            onToggleVisibility={() => setIsPasswordVisible((visible) => !visible)}
                        />
                    )}

                    {mode === 'verify' && (
                        <label className="block text-sm font-semibold text-slate-700">Code de vérification
                            <input required value={code} onChange={(event) => setCode(event.target.value)} className={`${inputClassName} mt-2`} />
                        </label>
                    )}

                    {mode === 'reset' && (
                        <>
                            <label className="block text-sm font-semibold text-slate-700">Jeton de réinitialisation
                                <input required value={token} onChange={(event) => setToken(event.target.value)} className={`${inputClassName} mt-2`} />
                            </label>
                            <PasswordField
                                label="Nouveau mot de passe"
                                value={password}
                                onChange={setPassword}
                                autoComplete="new-password"
                                visible={isPasswordVisible}
                                onToggleVisibility={() => setIsPasswordVisible((visible) => !visible)}
                            />
                            <PasswordField
                                label="Confirmer le mot de passe"
                                value={confirmPassword}
                                onChange={setConfirmPassword}
                                autoComplete="new-password"
                                visible={isConfirmPasswordVisible}
                                onToggleVisibility={() => setIsConfirmPasswordVisible((visible) => !visible)}
                            />
                        </>
                    )}

                    {error && <p role="alert" className="text-xs font-medium text-red-600">{error}</p>}
                    {success && <p role="status" className="text-xs font-medium text-emerald-700">{success}</p>}

                    <Button type="submit" disabled={isSubmitting} className="h-11 w-full rounded-xl bg-emerald-700 font-semibold hover:bg-emerald-800">
                        {isSubmitting ? 'Veuillez patienter…' : {
                            login: 'Se connecter',
                            signup: 'Créer mon compte',
                            verify: 'Vérifier mon compte',
                            forgot: 'Envoyer le lien',
                            reset: 'Modifier le mot de passe',
                        }[mode]}
                    </Button>
                </form>

                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-medium text-emerald-700">
                    {mode === 'login' && <>
                        <button type="button" onClick={() => changeMode('signup')}>Créer un compte</button>
                        <button type="button" onClick={() => changeMode('forgot')}>Mot de passe oublié ?</button>
                    </>}
                    {mode === 'signup' && <button type="button" onClick={() => changeMode('login')}>Déjà inscrit ? Se connecter</button>}
                    {mode === 'verify' && <>
                        <button type="button" disabled={isSubmitting} onClick={handleResendOtp}>Renvoyer le code</button>
                        <button type="button" onClick={() => changeMode('login')}>Retour à la connexion</button>
                    </>}
                    {(mode === 'forgot' || mode === 'reset') && <button type="button" onClick={() => changeMode('login')}>Retour à la connexion</button>}
                </div>

                <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-xs text-slate-400"><ShieldCheck className="h-3.5 w-3.5" />Vos données restent protégées.</p>
            </DialogContent>
        </Dialog>
    )
}
