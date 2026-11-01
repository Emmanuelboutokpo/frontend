'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthDialog from '@/components/front-office/AuthDialog'
import { Button } from '@/components/ui/button'
import { getTokenExpirationTime, useAuthStore, type AuthRole } from '@/store/authStore'

type RoleGuardProps = {
    audience: 'admin' | 'users'
    children: React.ReactNode
}

function canAccessAudience(role: AuthRole | null, audience: RoleGuardProps['audience']) {
    return audience === 'admin'
        ? role === 'ADMIN'
        : role === 'CLIENT' || role === 'PROPRIETAIRE'
}

function getRoleHome(role: AuthRole | null) {
    if (role === 'ADMIN') return '/admin'
    if (role === 'CLIENT' || role === 'PROPRIETAIRE') return '/users'
    return '/'
}

export function RoleGuard({ audience, children }: RoleGuardProps) {
    const router = useRouter()
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const sessionExpired = useAuthStore((state) => state.sessionExpired)
    const accessToken = useAuthStore((state) => state.accessToken)
    const expireSession = useAuthStore((state) => state.expireSession)
    const role = useAuthStore((state) => state.role)
    const [hasHydrated, setHasHydrated] = useState(false)
    const [authDialogOpen, setAuthDialogOpen] = useState(false)

    useEffect(() => {
        const unsubscribe = useAuthStore.persist.onFinishHydration(() => setHasHydrated(true))
        setHasHydrated(useAuthStore.persist.hasHydrated())
        return unsubscribe
    }, [])

    useEffect(() => {
        if (!hasHydrated || !isAuthenticated || !accessToken) return

        let timeoutId: ReturnType<typeof setTimeout> | undefined
        const checkExpiration = () => {
            const expiresAt = getTokenExpirationTime(accessToken)
            if (expiresAt === null) return
            const remaining = expiresAt - Date.now()
            if (remaining <= 0) {
                if (useAuthStore.getState().accessToken === accessToken) {
                    expireSession()
                }
                return
            }
            timeoutId = setTimeout(checkExpiration, Math.min(remaining, 2_147_000_000))
        }

        checkExpiration()
        return () => {
            if (timeoutId !== undefined) clearTimeout(timeoutId)
        }
    }, [hasHydrated, isAuthenticated, accessToken, expireSession])

    useEffect(() => {
        if (sessionExpired) setAuthDialogOpen(true)
    }, [sessionExpired])

    const isAuthorized = canAccessAudience(role, audience)

    useEffect(() => {
        if (hasHydrated && isAuthenticated && !isAuthorized) {
            router.replace(getRoleHome(role))
        }
    }, [hasHydrated, isAuthenticated, isAuthorized, role, router])

    if (!hasHydrated) {
        return <div className="grid min-h-screen place-items-center text-sm text-slate-500">Chargement de votre session…</div>
    }

    if (!isAuthenticated) {
        return (
            <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
                <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <h1 className="text-xl font-bold text-slate-900">Connexion requise</h1>
                    <p className="mt-2 text-sm text-slate-600">
                        {sessionExpired
                            ? 'Votre session a expiré. Reconnectez-vous pour continuer.'
                            : `Connectez-vous avec un compte ${audience === 'admin' ? 'administrateur' : 'utilisateur'} pour accéder à cet espace.`}
                    </p>
                    <Button type="button" onClick={() => setAuthDialogOpen(true)} className="mt-5 rounded-xl bg-emerald-700 hover:bg-emerald-800">
                        Se connecter
                    </Button>
                    <AuthDialog
                        open={authDialogOpen}
                        onOpenChange={setAuthDialogOpen}
                        title={audience === 'admin' ? 'Connexion à l’espace administration' : 'Connexion à votre espace'}
                    />
                </section>
            </main>
        )
    }

    if (!isAuthorized) {
        return <div className="grid min-h-screen place-items-center text-sm text-slate-500">Redirection vers votre espace…</div>
    }

    return <>{children}</>
}
