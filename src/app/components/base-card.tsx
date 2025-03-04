'use client'
import { type Base } from '@prisma/client'
import React from 'react'
import { Card } from '~/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation';

export default function BaseCard({ base }: { base: Base }) {
	const router = useRouter();
	return (
		<Card className="flex items-start gap-4 mt-3 p-4 cursor-pointer" onClick={() => router.push(`/${base.id}`)}>
			<div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#F6B73C] text-white text-2xl font-medium">
				Te
			</div>
			<div className="flex flex-col gap-1">
				<h2 className="font-medium">{base.name}</h2>
				<p className="text-sm text-muted-foreground">
					{formatDistanceToNow(new Date(base.createdAt), { addSuffix: true })}
				</p>
			</div>
		</Card>
	)
}
