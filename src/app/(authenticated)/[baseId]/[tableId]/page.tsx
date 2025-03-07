import { AlignJustify, Badge, BarChart2, Calendar, ChevronDown, Clock, Eye, Filter, Grid, GroupIcon, HelpCircle, KanbanSquare, LayoutGrid, List, Palette, Plus, Search, Share2, SortAsc, Wrench } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'
import TableTabs from '~/app/components/create-table-button'
import TableDisplay from '~/app/components/table'
import TableContainer from '~/app/components/table-container'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import { db } from '~/server/db'
import { faker } from '@faker-js/faker';
import { type Cell } from '@prisma/client'
import { Separator } from '~/components/ui/separator'
import { Input } from '~/components/ui/input'
import TableView from '~/app/components/table-view'
export default async function page({ params }: { params: Promise<{ baseId: string, tableId: string }> }) {
	const { baseId, tableId } = await params;
	const tables = await db.table.findMany({
		where: {
			baseId: baseId
		}
	});

	const createNewTable = async () => {
		'use server'
		const count = await db.table.count({
			where: {
				baseId: baseId
			}
		});

		// Generate random columns
		const columns = Array.from({ length: 4 }, (_, i) => ({
			name: faker.commerce.productName(),
			type: faker.helpers.arrayElement(['text', 'number']),
		}));

		// Generate random rows
		const rows = Array.from({ length: 6 }, () => ({}));

		const newTable = await db.table.create({
			data: {
				name: `Table ${count + 1}`,
				baseId: baseId,
				columns: {
					create: columns,
				},
				rows: {
					create: rows,
				}
			},
			include: { columns: true, rows: true, }
		});

		const cells: Cell[] = []
		// console.log('newTable', newTable)
		newTable.columns.forEach((column) => {
			newTable.rows.forEach((row) => {
				// @ts-ignore
				cells.push({
					value: column.type === 'number' ? faker.number.int({ min: 1, max: 99 }).toString() : faker.lorem.word(),
					columnId: column.id,
					rowId: row.id,
				})
			})
		})


		await db.cell.createMany({
			data: cells
		})

		redirect(`/${baseId}/${newTable.id}`)
	};

	const table = await db.table.findFirst({
		where: {
			id: tableId
		}
	});

	if (!table) {
		redirect(`/${baseId}`)
	}

	return (
		<div className='flex flex-col h-full'>
			<div className="flex flex-col">
				<header className="bg-[#C84A21] text-white">
					<div className="flex items-center h-14 px-4 gap-8">
						<div className="flex items-center gap-2">
							<div className="w-6 h-6 bg-white/20 rounded" />
							<div className="flex items-center gap-2">
								<span className="font-semibold">Untitled Base</span>
								<ChevronDown className="w-4 h-4 opacity-60" />
							</div>
						</div>
						<nav className="hidden md:flex items-center gap-6">
							<Link className="text-sm hover:opacity-80" href="#">
								Data
							</Link>
							<Link className="text-sm hover:opacity-80" href="#">
								Automations
							</Link>
							<Link className="text-sm hover:opacity-80" href="#">
								Interfaces
							</Link>
							<Link className="text-sm hover:opacity-80" href="#">
								Forms
							</Link>
						</nav>
						<div className="flex items-center gap-2 ml-auto">
							<Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
								<Clock className="w-4 h-4" />
							</Button>
							<Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
								<HelpCircle className="w-4 h-4" />
							</Button>
							<Button className="bg-white/20 hover:bg-white/30 text-white text-sm h-8" variant="ghost">
								Upgrade
							</Button>
							<Button className="bg-white/20 hover:bg-white/30 text-white text-sm h-8 gap-2" variant="ghost">
								<Share2 className="w-4 h-4" />
								Share
							</Button>
							<Avatar className="w-8 h-8">
								<AvatarFallback className="bg-white/20 text-white">P</AvatarFallback>
							</Avatar>
						</div>
					</div>
				</header>
				<TableTabs createNewTable={createNewTable} tables={tables} curTable={tableId} baseId={baseId} />
			</div>

			<TableView
				tableId={tableId}
			></TableView>
		</div>

	)
}



