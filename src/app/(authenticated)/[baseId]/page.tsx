import { redirect } from 'next/navigation'
import React from 'react'
import { db } from '~/server/db'

import { faker } from '@faker-js/faker';
import { type Cell } from '@prisma/client'
type Params = Promise<{ baseId: string }>

export default async function page({ params }: { params: Params }) {
	const { baseId } = await params;
	const count = await db.table.count({
		where: {
			baseId: baseId
		}
	})

	const firstTable = await db.table.findFirst({
		where: {
			baseId: baseId
		},
		include: {
			View: {
				take: 1,
				orderBy: {
					createdAt: 'asc' // or 'desc' depending on your requirement
				},
			}
		}
	})



	if (count == 0 || !firstTable) {
		// Generate random columns
		const columns = Array.from({ length: 4 }, (_, i) => ({
			name: faker.commerce.productName(),
			type: faker.helpers.arrayElement(['text', 'number']),
		}));

		// Generate random rows
		const rows = Array.from({ length: 1000 }, () => ({}));

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
		const view = await db.view.create({
			data: {
				name: 'Grid view',
				tableId: newTable.id,
				filters: {},
				sort: {},
				hiddenCols: [],
			}
		});
		redirect(`/${baseId}/${newTable.id}/${view.id}`)
	}

	// redirect to the first table
	redirect(`/${baseId}/${firstTable.id}/${firstTable.View[0]?.id}`)


	return (
		<div className='flex flex-col h-full'>
		</div>
	)
}
