'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthDialog from '@/components/front-office/AuthDialog'
import { Button } from '@/components/ui/button'
import { getTokenExpirationTime, useAuthStore, type AuthRole } from '@/store/authStore'
import { useOwnerApplicationStore } from '@/store/useOwnerApplicationStore'

type RoleGuardProps = {
    audience: 'admin' | 'users' | 'owners'
    children: React.ReactNode
}

function canAccessAudience(role: AuthRole | null, audience: RoleGuardProps['audience']) {
    if (audience === 'admin') return role === 'ADMIN'
    if (audience === 'owners') return role === 'PROPRIETAIRE'
    return role === 'CLIENT'
}

function getRoleHome(role: AuthRole | null) {
    if (role === 'ADMIN') return '/admin'
    if (role === 'PROPRIETAIRE') return '/owners'
    if (role === 'CLIENT') return '/users'
    return '/'
}

function isAllowedOwnerPath(pathname: string) {
    const allowedPaths = [
        '/owners',
        '/owners/users',
        '/owners/referentiels',
        '/owners/etablissements',
        '/owners/reservations',
        '/owners/transactions',
        '/owners/profil',
        '/owners/attente',
    ]
    return allowedPaths.some((path) =>
        path === '/owners' ? pathname === path : pathname === path || pathname.startsWith(`${path}/`),
    )
}

export function RoleGuard({ audience, children }: RoleGuardProps) {
    const router = useRouter()
    const pathname = usePathname()
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const sessionExpired = useAuthStore((state) => state.sessionExpired)
    const accessToken = useAuthStore((state) => state.accessToken)
    const expireSession = useAuthStore((state) => state.expireSession)
    const role = useAuthStore((state) => state.role)
    const application = useOwnerApplicationStore((state) => state.application)
    const applicationLoading = useOwnerApplicationStore((state) => state.isLoading)
    const applicationError = useOwnerApplicationStore((state) => state.error)
    const loadMyApplication = useOwnerApplicationStore((state) => state.loadMyApplication)
    const resetApplication = useOwnerApplicationStore((state) => state.reset)
    const [hasHydrated, setHasHydrated] = useState(false)
    const [authDialogOpen, setAuthDialogOpen] = useState(false)
    const [applicationCheckedToken, setApplicationCheckedToken] = useState<string | null>(null)

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
        if (
            hasHydrated &&
            isAuthenticated &&
            audience === 'owners' &&
            role === 'PROPRIETAIRE' &&
            accessToken
        ) {
            setApplicationCheckedToken(null)
            void loadMyApplication()
                .catch(() => undefined)
                .finally(() => {
                    if (useAuthStore.getState().accessToken === accessToken) {
                        setApplicationCheckedToken(accessToken)
                    }
                })
        } else if (audience === 'owners') {
            setApplicationCheckedToken(null)
            resetApplication()
        }
    }, [hasHydrated, isAuthenticated, audience, role, accessToken, loadMyApplication, resetApplication])

    const applicationChecked = applicationCheckedToken === accessToken && accessToken !== null

    useEffect(() => {
        if (hasHydrated && isAuthenticated && !isAuthorized) {
            router.replace(getRoleHome(role))
        }
    }, [hasHydrated, isAuthenticated, isAuthorized, role, router])

    useEffect(() => {
        if (
            !hasHydrated ||
            !isAuthenticated ||
            audience !== 'owners' ||
            role !== 'PROPRIETAIRE' ||
            !applicationChecked ||
            applicationLoading ||
            applicationError
        ) return

        if (!application) {
            router.replace('/devenir-proprietaire')
        } else if (application.status === 'APPROUVE') {
            if (pathname === '/owners/attente' || !isAllowedOwnerPath(pathname)) router.replace('/owners')
        } else if (pathname !== '/owners/attente') {
            router.replace('/owners/attente')
        }
    }, [
        hasHydrated,
        isAuthenticated,
        audience,
        role,
        applicationChecked,
        application,
        applicationLoading,
        applicationError,
        pathname,
        router,
    ])

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
                            : `Connectez-vous avec un compte ${audience === 'admin' ? 'administrateur' : audience === 'owners' ? 'propriétaire' : 'utilisateur'} pour accéder à cet espace.`}
                    </p>
                    <Button type="button" onClick={() => setAuthDialogOpen(true)} className="mt-5 rounded-xl bg-emerald-700 hover:bg-emerald-800">
                        Se connecter
                    </Button>
                    {audience === 'owners' && (
                        <p className="mt-4 text-sm text-slate-600">
                            Pas encore de compte ?{" "}
                            <Link href="/devenir-proprietaire" className="font-semibold text-emerald-700 hover:underline">
                                Créer un compte propriétaire
                            </Link>
                        </p>
                    )}
                    <AuthDialog
                        open={authDialogOpen}
                        onOpenChange={setAuthDialogOpen}
                        title={audience === 'admin' ? 'Connexion à l’espace administration' : audience === 'owners' ? 'Connexion à l’espace propriétaire' : 'Connexion à votre espace'}
                    />
                </section>
            </main>
        )
    }

    if (!isAuthorized) {
        return <div className="grid min-h-screen place-items-center text-sm text-slate-500">Redirection vers votre espace…</div>
    }

    if (audience === 'owners') {
        if (!applicationChecked || applicationLoading || (!application && !applicationError)) {
            return <div className="grid min-h-screen place-items-center text-sm text-slate-500">Vérification de votre dossier propriétaire…</div>
        }
        if (applicationError) {
            return (
                <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
                    <section className="w-full max-w-lg rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
                        <h1 className="text-xl font-bold text-slate-900">Dossier indisponible</h1>
                        <p role="alert" className="mt-3 text-sm text-rose-700">{applicationError}</p>
                        <Button type="button" onClick={() => void loadMyApplication().catch(() => undefined)} className="mt-5 rounded-xl bg-emerald-700 hover:bg-emerald-800">
                            Réessayer
                        </Button>
                    </section>
                </main>
            )
        }
        if (application?.status === 'APPROUVE' && (pathname === '/owners/attente' || !isAllowedOwnerPath(pathname))) {
            return <div className="grid min-h-screen place-items-center text-sm text-slate-500">Redirection vers votre espace propriétaire…</div>
        }
        if (application?.status !== 'APPROUVE' && pathname !== '/owners/attente') {
            return <div className="grid min-h-screen place-items-center text-sm text-slate-500">Redirection vers le suivi de votre dossier…</div>
        }
    }

    return <>{children}</>
}
