 'use client'

import PropertyDetail from '@/components/front-office/PropertyDetail'
import { useParams } from 'next/navigation'


export default function LoisirDetailPage() {
	const params = useParams<{ slug: string }>()
	return <PropertyDetail slug={params.slug} />
}
