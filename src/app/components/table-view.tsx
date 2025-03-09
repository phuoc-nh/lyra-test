'use client'
import { AlignJustify, Calendar, EyeOff, Filter, Grid, KanbanSquare, LayoutGrid, List, Plus, Search, SortAsc, WandSparkles } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'
import TableContainer from './table-container'
import { cn } from '~/lib/utils'
import { HideColsPopover } from './hide-col-popover'
import { FilterPopover } from './filter-popover'
import { SortPopover } from './sort-popover'
import { SeedPopover } from './seed-popover'

export default function TableView({ tableId, viewId }: { tableId: string, viewId: number }) {
	const [displayViewTab, setDisplayViewTab] = useState(false)
	const [shouldRefetch, setShouldRefetch] = useState(false)

	return (
		<>
			<div className="flex items-center h-10 px-2 border-b gap-2">
				<div className="flex items-center">
					<Button variant="ghost" size="sm" className={cn(
						"gap-2",
						displayViewTab ? 'bg-gray-100' : ''
					)} onClick={
						() => setDisplayViewTab(!displayViewTab)
					}>
						<AlignJustify className="w-4 h-4" />
						Views
					</Button>
					<Separator orientation="vertical" className="mx-2 h-5" />
					<div className="flex items-center gap-1">
						<HideColsPopover>
							<Button variant="ghost" size="sm" className="gap-2">
								<EyeOff className="w-4 h-4" />
								Hide fields
							</Button>
						</HideColsPopover>

						<FilterPopover tableId={tableId} viewId={viewId} >
							<Button variant="ghost" size="sm" className="gap-2">
								<Filter className="w-4 h-4" />
								Filter
							</Button>
						</FilterPopover>

						<SortPopover>
							<Button variant="ghost" size="sm" className="gap-2">
								<SortAsc className="w-4 h-4" />
								Sort
							</Button>
						</SortPopover>

						<SeedPopover tableId={tableId} setShouldRefetch={setShouldRefetch}>
							<Button variant="ghost" size="sm" className="gap-2">
								<WandSparkles className="w-4 h-4" />
								Seed data
							</Button>
						</SeedPopover>
					</div>
				</div>
			</div>
			<div className='flex flex-row'>
				<div className="w-[280px] rounded-lg flex flex-col " style={{ display: displayViewTab ? '' : 'none' }}>
					<div className='mb-10'>
						<div className="p-2">
							<div className="relative">
								<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input placeholder="Find a view" className="pl-8" />
							</div>
						</div>
						<div className="px-2 py-2">
							<div className="flex items-center gap-2 px-2 py-1">
								<Grid className="h-4 w-4 text-blue-600" />
								<span className="font-medium text-sm">Grid view</span>
							</div>
						</div>
					</div>
					<div>
						<Separator />
						<div className="p-2">
							<div className="flex items-center justify-between px-2 py-1.5">
								<span className="text-sm font-medium">Create...</span>
							</div>
							<div className="space-y-1">
								<Button variant="ghost" className="w-full justify-between">
									<div className="flex items-center gap-2">
										<Grid className="h-4 w-4 text-blue-600" />
										Grid
									</div>
									<Plus className="h-4 w-4" />
								</Button>
								<Button variant="ghost" className="w-full justify-between">
									<div className="flex items-center gap-2">
										<Calendar className="h-4 w-4 text-orange-600" />
										Calendar
									</div>
									<Plus className="h-4 w-4" />
								</Button>
								<Button variant="ghost" className="w-full justify-between">
									<div className="flex items-center gap-2">
										<LayoutGrid className="h-4 w-4 text-purple-600" />
										Gallery
									</div>
									<Plus className="h-4 w-4" />
								</Button>
								<Button variant="ghost" className="w-full justify-between">
									<div className="flex items-center gap-2">
										<KanbanSquare className="h-4 w-4 text-green-600" />
										Kanban
									</div>
									<Plus className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				</div>
				<TableContainer
					tableId={tableId}
					shouldRefetch={shouldRefetch}
					viewId={viewId}
				></TableContainer>
			</div>
		</>
	)
}
