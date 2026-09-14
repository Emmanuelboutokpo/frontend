import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type AuthState = {
    isAuthenticated: boolean
    email: string | null,
    firstName: string | null,
    lastName: string | null,
    avatar: string | null,
    updateProfile: (form: { firstName: string, lastName: string, email?: string }) => void
    signIn: (email: string) => void
    signOut: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            email: null,
            firstName: null,
            lastName: null,
            avatar: null,
            updateProfile: (form) => set((state) => ({ firstName: form.firstName, lastName: form.lastName, email: form.email ?? state.email })),
            signIn: (email) => {
                const name = email.split('@')[0].replace(/[._-]+/g, ' ').trim()
                const [firstName = '', ...lastNameParts] = name.split(' ')
                set({
                    isAuthenticated: true,
                    email,
                    firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
                    lastName: lastNameParts.join(' ').replace(/\b\w/g, (letter) => letter.toUpperCase()),
                    avatar: `https://i.pravatar.cc/160?u=${encodeURIComponent(email)}`,
                })
            },
            signOut: () => set({ isAuthenticated: false, email: null, firstName: null, lastName: null, avatar: null }),
        }),
        {
            name: 'bestreserv-auth',
            storage: createJSONStorage(() => localStorage),
        },
    ),
)
