import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";
export type Data = Record<string, { id: number, value: string | number | null, rowId: number, columnId: number }>;
import { faker } from '@faker-js/faker';

export const tableRouter = createTRPCRouter({

	getPaginatedRows: protectedProcedure.input(z.object({
		tableId: z.string(),
		cursor: z.number().nullish(),
		limit: z.number().min(1).max(100).default(100),
	})).query(async ({ input, ctx }) => {
		const { tableId, cursor, limit } = input;

		const rows = await ctx.db.row.findMany({
			where: { tableId },
			take: limit + 1,
			cursor: cursor ? { id: cursor } : undefined,
			include: {
				cells: true,
			},
			orderBy: { id: "asc" },
			// orderBy: { createdAt: "desc" },

		});
		// console.log('rows >>>> ', rows);
		let nextCursor: typeof cursor | null = null;
		if (rows.length > limit) {
			const nextItem = rows.pop();
			// console.log('nextItem >>>> ', nextItem);
			nextCursor = nextItem!.id;
		}

		const rowData = rows.map((row) => {
			const rowData: Data = {};
			row.cells.forEach((cell) => {
				rowData[cell.columnId] = { id: cell.id, value: cell.value, rowId: row.id, columnId: cell.columnId };
			});
			return rowData;
		});
		

		return {
			rows: rowData,
			nextCursor,
		};
	}),

	seedData: protectedProcedure.input(z.object({
		tableId: z.string(),
		rows: z.number().min(1).default(10),
		columns: z.number().min(1).default(5),
	})).mutation(async ({ input, ctx }) => {
		const { tableId, rows, columns } = input;

		// remove all current rows and columns
		await ctx.db.row.deleteMany({ where: { tableId } });
		await ctx.db.column.deleteMany({ where: { tableId } });
		

		// Create rows
		const createdRows = await ctx.db.row.createManyAndReturn({
			data: Array.from({ length: rows }).map(() => ({
				tableId,
			}),
			),
		});
		// use faker to generate random column name
		
		// Create columns
		const createdColumns = await ctx.db.column.createManyAndReturn({
			data: Array.from({ length: columns }).map(() => ({
				tableId,
				name: faker.food.fruit(),
				type: "text",
			}),
			),
		});

		// Create cells
		const cellsData = createdRows.flatMap((row) =>
			createdColumns.map((column) => ({
				value: faker.word.words({count: 1}),
				columnId: column.id,
				rowId: row.id,
			}),
			),
		);

		const createdCells = await ctx.db.cell.createManyAndReturn({
			data: cellsData,
		});

		return {
			success: true,
		};
	}),
		

});


