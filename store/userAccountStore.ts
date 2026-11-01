import { create } from 'zustand'
import { isTokenExpiredResponse, useAuthStore } from './authStore'

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'https://bestreservs-api.onrender.com').replace(/\/+$/, '')
const ACCOUNT_PATH = '/api/v1/users/me'

export type AccountProfile = {
    email: string
    firstName: string
    lastName: string
    phone: string
    bio: string
    city: string
    language: string
    currency: string
    avatar: string | null
}

export type AccountNotification = {
    id: string
    type: string
    title: string
    message: string
    action_url: string | null
    is_read: boolean
    read_at: string | null
    created_at: string
}

type AccountResponse = {
    email?: string
    profile?: {
        firstName?: string | null
        lastName?: string | null
        phone?: string | null
        bio?: string | null
        city?: string | null
        language?: string | null
        currency?: string | null
        img?: string | null
    } | null
}

type NotificationPage = {
    items: AccountNotification[]
    limit: number
    offset: number
}

type UserAccountState = {
    profile: AccountProfile | null
    notifications: AccountNotification[]
    unreadCount: number
    notificationOffset: number
    hasMoreNotifications: boolean
    isLoadingProfile: boolean
    isLoadingNotifications: boolean
    error: string | null
    profileError: string | null
    notificationsError: string | null
    loadProfile: () => Promise<void>
    updateProfile: (patch: Partial<Pick<AccountProfile, 'firstName' | 'lastName' | 'phone' | 'bio' | 'city' | 'language' | 'currency'>>) => Promise<void>
    uploadAvatar: (file: File) => Promise<void>
    deleteAvatar: () => Promise<void>
    changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<void>
    deleteAccount: (currentPassword: string) => Promise<void>
    loadNotifications: (reset?: boolean) => Promise<void>
    markNotificationRead: (id: string) => Promise<void>
    markAllNotificationsRead: () => Promise<void>
    deleteNotification: (id: string) => Promise<void>
    loadUnreadCount: () => Promise<void>
    reset: () => void
}

function getErrorMessage(body: unknown, status: number) {
    if (typeof body !== 'object' || body === null) return `La requête a échoué (${status}).`
    const detail = 'detail' in body ? body.detail : 'message' in body ? body.message : null
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) {
        const messages = detail
            .map((item) => typeof item === 'object' && item !== null && 'msg' in item ? item.msg : '')
            .filter((message): message is string => typeof message === 'string' && Boolean(message))
        if (messages.length) return messages.join(', ')
    }
    return `La requête a échoué (${status}).`
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = useAuthStore.getState().accessToken
    if (!token) throw new Error('Vous devez être connecté pour effectuer cette action.')

    const response = await fetch(`${API_URL}${ACCOUNT_PATH}${path}`, {
        ...options,
        headers: {
            Authorization: 'Bearer ' + token,
            ...(options.body instanceof FormData ? {} : options.body ? { 'Content-Type': 'application/json' } : {}),
            ...options.headers,
        },
    })
    const body: unknown = await response.json().catch(() => null)
    if (isTokenExpiredResponse(response.status, body) && useAuthStore.getState().accessToken === token) {
        useAuthStore.getState().expireSession()
    }
    if (!response.ok) throw new Error(getErrorMessage(body, response.status))
    return body as T
}

function mapAccount(data: AccountResponse): AccountProfile {
    return {
        email: data.email ?? '',
        firstName: data.profile?.firstName ?? '',
        lastName: data.profile?.lastName ?? '',
        phone: data.profile?.phone ?? '',
        bio: data.profile?.bio ?? '',
        city: data.profile?.city ?? '',
        language: data.profile?.language ?? 'fr',
        currency: data.profile?.currency ?? 'XOF',
        avatar: data.profile?.img ?? null,
    }
}

function updateLocalProfile(profile: AccountProfile) {
    useAuthStore.getState().updateProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
    })
    useAuthStore.setState({ avatar: profile.avatar })
}

export const useUserAccountStore = create<UserAccountState>((set, get) => ({
    profile: null,
    notifications: [],
    unreadCount: 0,
    notificationOffset: 0,
    hasMoreNotifications: true,
    isLoadingProfile: false,
    isLoadingNotifications: false,
    error: null,
    profileError: null,
    notificationsError: null,

    reset: () => set({
        profile: null,
        notifications: [],
        unreadCount: 0,
        notificationOffset: 0,
        hasMoreNotifications: true,
        isLoadingProfile: false,
        isLoadingNotifications: false,
        error: null,
        profileError: null,
        notificationsError: null,
    }),

    loadProfile: async () => {
        set({ isLoadingProfile: true, profileError: null })
        try {
            const data = await request<AccountResponse>('')
            const profile = mapAccount(data)
            set({ profile })
            updateLocalProfile(profile)
        } catch (error) {
            set({ profileError: error instanceof Error ? error.message : 'Impossible de charger votre profil.' })
            throw error
        } finally {
            set({ isLoadingProfile: false })
        }
    },

    updateProfile: async (patch) => {
        set({ profileError: null })
        try {
            const data = await request<AccountResponse>('', {
                method: 'PATCH',
                body: JSON.stringify({
                    ...(patch.firstName !== undefined ? { firstName: patch.firstName } : {}),
                    ...(patch.lastName !== undefined ? { lastName: patch.lastName } : {}),
                    ...(patch.phone !== undefined ? { phone: patch.phone } : {}),
                    ...(patch.bio !== undefined ? { bio: patch.bio } : {}),
                    ...(patch.city !== undefined ? { city: patch.city } : {}),
                    ...(patch.language !== undefined ? { language: patch.language } : {}),
                    ...(patch.currency !== undefined ? { currency: patch.currency } : {}),
                }),
            })
            const profile = mapAccount(data)
            set({ profile })
            updateLocalProfile(profile)
        } catch (error) {
            set({ profileError: error instanceof Error ? error.message : 'Impossible de modifier votre profil.' })
            throw error
        }
    },

    uploadAvatar: async (file) => {
        set({ profileError: null })
        const formData = new FormData()
        formData.append('avatar', file)
        try {
            const data = await request<AccountResponse>('/avatar', { method: 'POST', body: formData })
            const profile = mapAccount(data)
            set({ profile })
            updateLocalProfile(profile)
        } catch (error) {
            set({ profileError: error instanceof Error ? error.message : 'Impossible de téléverser votre photo.' })
            throw error
        }
    },

    deleteAvatar: async () => {
        set({ profileError: null })
        try {
            const data = await request<AccountResponse>('/avatar', { method: 'DELETE' })
            const profile = mapAccount(data)
            set({ profile })
            updateLocalProfile(profile)
        } catch (error) {
            set({ profileError: error instanceof Error ? error.message : 'Impossible de supprimer votre photo.' })
            throw error
        }
    },

    changePassword: async (currentPassword, newPassword, confirmPassword) => {
        set({ error: null })
        try {
            await request('/password', {
                method: 'PUT',
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                    confirm_password: confirmPassword,
                }),
            })
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Impossible de modifier le mot de passe.' })
            throw error
        }
    },

    deleteAccount: async (currentPassword) => {
        set({ error: null })
        try {
            await request('', {
                method: 'DELETE',
                body: JSON.stringify({ confirmation: 'DELETE', current_password: currentPassword }),
            })
            set({ profile: null, notifications: [], unreadCount: 0 })
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Impossible de supprimer le compte.' })
            throw error
        }
    },

    loadNotifications: async (reset = false) => {
        const offset = reset ? 0 : get().notificationOffset
        if (get().isLoadingNotifications) return
        set({ isLoadingNotifications: true, notificationsError: null })
        try {
            const page = await request<NotificationPage>(`/notifications?limit=20&offset=${offset}`)
            set((state) => ({
                notifications: reset ? page.items : [...state.notifications, ...page.items],
                notificationOffset: page.offset + page.items.length,
                hasMoreNotifications: page.items.length === page.limit,
            }))
        } catch (error) {
            set({ notificationsError: error instanceof Error ? error.message : 'Impossible de charger les notifications.' })
            throw error
        } finally {
            set({ isLoadingNotifications: false })
        }
    },

    markNotificationRead: async (id) => {
        await request(`/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH' })
        set((state) => ({
            notifications: state.notifications.map((item) => item.id === id ? { ...item, is_read: true } : item),
            unreadCount: Math.max(0, state.unreadCount - (state.notifications.find((item) => item.id === id && !item.is_read) ? 1 : 0)),
        }))
    },

    markAllNotificationsRead: async () => {
        await request('/notifications/read-all', { method: 'PATCH' })
        set((state) => ({
            notifications: state.notifications.map((item) => ({ ...item, is_read: true })),
            unreadCount: 0,
        }))
    },

    deleteNotification: async (id) => {
        await request(`/notifications/${encodeURIComponent(id)}`, { method: 'DELETE' })
        set((state) => ({
            notifications: state.notifications.filter((item) => item.id !== id),
            unreadCount: Math.max(0, state.unreadCount - (state.notifications.find((item) => item.id === id && !item.is_read) ? 1 : 0)),
        }))
    },

    loadUnreadCount: async () => {
        try {
            const result = await request<{ unread_count: number }>('/notifications/unread-count')
            set({ unreadCount: result.unread_count, notificationsError: null })
        } catch (error) {
            set({ notificationsError: error instanceof Error ? error.message : 'Impossible de charger le nombre de notifications non lues.' })
            throw error
        }
    },
}))
