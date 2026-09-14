 'use client'

import { useParams } from 'next/navigation'
import PropertyDetail from '@/components/front-office/PropertyDetail'

export default function HebergementDetailPage() {
	const params = useParams<{ slug: string }>()
	return <PropertyDetail slug={params.slug} />
}
