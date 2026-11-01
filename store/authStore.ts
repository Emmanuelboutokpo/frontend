import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'https://bestreservs-api.onrender.com').replace(/\/+$/, '')
const AUTH_PATH = '/api/v1/auth'

type AuthUser = {
    email?: string
    role?: string
    first_name?: string
    last_name?: string
    firstName?: string
    lastName?: string
    avatar?: string
    picture?: string
}

type AuthResponse = {
    access_token?: string
    refresh_token?: string
    user?: AuthUser
    data?: AuthResponse
}

export type AuthRole = 'CLIENT' | 'PROPRIETAIRE' | 'ADMIN'

export function getTokenExpirationTime(token: string | null): number | null {
    const payload = token?.split('.')[1]
    if (!payload) return null

    try {
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
        const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
        const decoded = globalThis.atob(paddedBase64)
        const claims: unknown = JSON.parse(decoded)
        if (typeof claims !== 'object' || claims === null || !('exp' in claims)) return null
        return typeof claims.exp === 'number' ? claims.exp * 1000 : null
    } catch {
        return null
    }
}

export function isTokenExpiredResponse(status: number, body: unknown): boolean {
    if (status === 401) return true
    if (typeof body !== 'object' || body === null) return false

    const detail = 'detail' in body ? body.detail : 'message' in body ? body.message : null
    return typeof detail === 'string' &&
        detail.toLowerCase().includes('token') &&
        detail.toLowerCase().includes('expir')
}

type AuthState = {
    isAuthenticated: boolean
    sessionExpired: boolean
    role: AuthRole | null
    email: string | null
    firstName: string | null
    lastName: string | null
    avatar: string | null
    accessToken: string | null
    refreshToken: string | null
    updateProfile: (form: { firstName: string, lastName: string, email?: string }) => void
    signUp: (email: string, password: string) => Promise<void>
    verifyOtp: (email: string, code: string) => Promise<void>
    resendOtp: (email: string) => Promise<void>
    signIn: (email: string, password: string) => Promise<void>
    refreshAccessToken: () => Promise<void>
    forgotPassword: (email: string) => Promise<void>
    resetPassword: (token: string, newPassword: string, confirmPassword: string) => Promise<void>
    signOut: () => Promise<void>
    clearSession: () => void
    expireSession: () => void
}

async function request(path: string, options: RequestInit = {}, token?: string) {
    const response = await fetch(`${API_URL}${AUTH_PATH}${path}`, {
        ...options,
        headers: {
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
            ...(token ? { Authorization: 'Bearer ' + token } : {}),
            ...options.headers,
        },
    })

    const body: unknown = await response.json().catch(() => null)
    if (!response.ok) {
        if (token && isTokenExpiredResponse(response.status, body) && useAuthStore.getState().accessToken === token) {
            useAuthStore.getState().expireSession()
        }
        const detail = typeof body === 'object' && body !== null && 'detail' in body
            ? body.detail
            : typeof body === 'object' && body !== null && 'message' in body
                ? body.message
                : null
        const message = typeof detail === 'string'
            ? detail
            : Array.isArray(detail)
                ? detail.map((item) => typeof item === 'object' && item !== null && 'msg' in item ? item.msg : '').filter(Boolean).join(', ')
                : `La requête a échoué (${response.status}).`
        throw new Error(message || `La requête a échoué (${response.status}).`)
    }

    return body
}

function getAuthPayload(body: unknown): AuthResponse {
    if (typeof body !== 'object' || body === null) return {}
    const response = body as AuthResponse
    return response.data && typeof response.data === 'object' ? response.data : response
}

function getAuthRole(role: string | undefined): AuthRole | null {
    if (role === 'CLIENT' || role === 'PROPRIETAIRE' || role === 'ADMIN') return role
    return null
}

function getUserName(user: AuthUser | undefined, field: 'firstName' | 'lastName', email: string) {
    const name = field === 'firstName' ? user?.first_name ?? user?.firstName : user?.last_name ?? user?.lastName
    if (name) return name
    if (field === 'firstName') {
        const localPart = email.split('@')[0].replace(/[._-]+/g, ' ').trim()
        return localPart.split(' ')[0]?.replace(/\b\w/g, (letter) => letter.toUpperCase()) ?? ''
    }
    return ''
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            sessionExpired: false,
            role: null,
            email: null,
            firstName: null,
            lastName: null,
            avatar: null,
            accessToken: null,
            refreshToken: null,
            updateProfile: (form) => set((state) => ({
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email ?? state.email,
            })),
            signUp: async (email, password) => {
                await request('/signup', {
                    method: 'POST',
                    body: JSON.stringify({ email, password }),
                })
            },
            verifyOtp: async (email, code) => {
                await request(`/verify-otp?${new URLSearchParams({ code })}`, {
                    method: 'POST',
                    body: JSON.stringify({ email }),
                })
            },
            resendOtp: async (email) => {
                await request('/resend-otp', {
                    method: 'POST',
                    body: JSON.stringify({ email }),
                })
            },
            signIn: async (email, password) => {
                const body = await request('/login', {
                    method: 'POST',
                    body: JSON.stringify({ email, password }),
                })
                const payload = getAuthPayload(body)
                if (!payload.access_token) {
                    throw new Error('La réponse de connexion ne contient pas de jeton d’accès.')
                }
                const user = payload.user
                const role = getAuthRole(user?.role)
                if (!role) {
                    throw new Error('La réponse de connexion ne contient pas un rôle valide.')
                }
                set({
                    isAuthenticated: true,
                    sessionExpired: false,
                    role,
                    email: user?.email ?? email,
                    firstName: getUserName(user, 'firstName', email),
                    lastName: getUserName(user, 'lastName', email),
                    avatar: user?.avatar ?? user?.picture ?? null,
                    accessToken: payload.access_token,
                    refreshToken: payload.refresh_token ?? null,
                })
            },
            refreshAccessToken: async () => {
                const refreshToken = get().refreshToken
                if (!refreshToken) throw new Error('Aucun jeton de rafraîchissement disponible.')
                const body = await request('/refresh_token', { method: 'GET' }, refreshToken)
                const payload = getAuthPayload(body)
                if (!payload.access_token) {
                    throw new Error('La réponse de renouvellement ne contient pas de jeton d’accès.')
                }
                set({
                    accessToken: payload.access_token,
                    refreshToken: payload.refresh_token ?? refreshToken,
                })
            },
            forgotPassword: async (email) => {
                await request('/forgot-password', {
                    method: 'POST',
                    body: JSON.stringify({ email }),
                })
            },
            resetPassword: async (token, newPassword, confirmPassword) => {
                await request('/reset-password', {
                    method: 'POST',
                    body: JSON.stringify({
                        token,
                        new_password: newPassword,
                        confirm_password: confirmPassword,
                    }),
                })
            },
            signOut: async () => {
                const accessToken = get().accessToken
                try {
                    if (accessToken) await request('/logout', { method: 'POST' }, accessToken)
                } finally {
                    get().clearSession()
                }
            },
            clearSession: () => set({
                isAuthenticated: false,
                sessionExpired: false,
                role: null,
                email: null,
                firstName: null,
                lastName: null,
                avatar: null,
                accessToken: null,
                refreshToken: null,
            }),
            expireSession: () => set({
                isAuthenticated: false,
                sessionExpired: true,
                role: null,
                email: null,
                firstName: null,
                lastName: null,
                avatar: null,
                accessToken: null,
                refreshToken: null,
            }),
        }),
        {
            name: 'bestreserv-auth',
            version: 2,
            migrate: (persistedState) => ({
                ...(persistedState as Partial<AuthState>),
                isAuthenticated: false,
                sessionExpired: false,
                role: null,
                email: null,
                firstName: null,
                lastName: null,
                avatar: null,
                accessToken: null,
                refreshToken: null,
            }),
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                sessionExpired: state.sessionExpired,
                role: state.role,
                email: state.email,
                firstName: state.firstName,
                lastName: state.lastName,
                avatar: state.avatar,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
            }),
        },
    ),
)
