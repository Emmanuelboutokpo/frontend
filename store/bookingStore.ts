'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type BookingStatus = 'pending' | 'paid' | 'cancelled'
export type PaymentProvider = "fedapay" | "kkpays" | "stripe";

export type Booking = {
    id: string
    propertyId: number
    propertyName: string
    propertyAddress: string
    checkIn: string
    checkOut: string
    guests: number
    nights: number
    amount: number
    currency: string
    paymentProvider: PaymentProvider | null
    status: BookingStatus
    createdAt: string
}

type BookingState = {
    bookings: Booking[]
    addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => string
    markAsPaid: (bookingId: string, provider: PaymentProvider) => void
    cancelBooking: (bookingId: string) => void
}

export const useBookingStore = create<BookingState>()(
    persist(
        (set) => ({
            bookings: [],
            addBooking: (booking) => {
                const id = `booking-${Date.now()}`
                set((state) => ({ bookings: [{ ...booking, id, createdAt: new Date().toISOString() }, ...state.bookings] }))
                return id
            },
            markAsPaid: (bookingId, provider) => set((state) => ({ bookings: state.bookings.map((booking) => booking.id === bookingId ? { ...booking, status: 'paid', paymentProvider: provider } : booking) })),
            cancelBooking: (bookingId) => set((state) => ({ bookings: state.bookings.map((booking) => booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking) })),
        }),
        { name: 'bestreserv-bookings', storage: createJSONStorage(() => localStorage) },
    ),
)
