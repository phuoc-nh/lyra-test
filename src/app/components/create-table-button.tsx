'use client'

import { type Table } from '@prisma/client'
import { ChevronDown, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

export default function TableTabs({ createNewTable, tables, curTable, baseId }: { createNewTable: () => void, tables: Table[], curTable: string, baseId: string }) {
	const isActive = (tableId: string) => tableId === curTable;
	const router = useRouter();

	return (
		<div className="flex items-center h-10 px-4  border-b bg-[#C03D05]">
			{tables.map((table) => (
				<div key={table.id} onClick={() => router.push(`/${baseId}/${table.id}`)} className={
					cn(
						"text-sm h-10 gap-2 text-white flex justify-between items-center p-3 cursor-pointer",
						{ "bg-white text-black rounded-t-sm": isActive(table.id) })
				} >
					{table.name}
					<ChevronDown className="w-4 h-4 opacity-60" />
				</div>
			))}
			<Button size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={createNewTable}>
				<Plus className="w-4 h-4" />
			</Button>
			<div className="ml-auto flex items-center gap-2">
				<Button variant="ghost" className="h-8 text-white">
					Extensions
				</Button>
				<Button variant="ghost" className="h-8 text-white">
					Tools
				</Button>
			</div>
		</div>
	)
}
