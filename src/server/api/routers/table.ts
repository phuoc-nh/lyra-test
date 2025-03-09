import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";
export type Data = Record<string, { id: number, value: string | number | null, rowId: number, columnId: number }>;
import { faker } from '@faker-js/faker';

export const tableRouter = createTRPCRouter({
	//   hello: publicProcedure
	//     .input(z.object({ text: z.string() }))
	//     .query(({ input }) => {
	//       return {
	//         greeting: `Hello ${input.text}`,
	//       };
	//     }),

	// create: protectedProcedure
	// 	.input(z.object({ name: z.string().min(1) }))
	// 	.mutation(async ({ ctx, input }) => {
	// 		return ctx.db.post.create({
	// 			data: {
	// 				name: input.name,
	// 				createdBy: { connect: { id: ctx.session.user.id } },
	// 			},
	// 		});
	// 	}),

	//   getLatest: protectedProcedure.query(async ({ ctx }) => {
	//     const post = await ctx.db.post.findFirst({
	//       orderBy: { createdAt: "desc" },
	//       where: { createdBy: { id: ctx.session.user.id } },
	//     });

	//     return post ?? null;
	//   }),

	getPaginatedRows: protectedProcedure.input(z.object({
		tableId: z.string(),
		cursor: z.number().nullish(),
		limit: z.number().min(1).max(100).default(100),
		viewId: z.number().nullish(),
		filter: z.string().optional(), // Add 
	})).query(async ({ input, ctx }) => {
		const { tableId, cursor, limit, viewId, filter } = input;

		// const view = await ctx.db.view.findUnique({
		// 	where: { id: parseInt(viewId) },
		//   });
	  
		//   let whereConditions = {};
		  
		// 	// Apply search filter
		//   if (view?.search) {
		// 	whereConditions.cells = {
		// 	  some: {
		// 		value: { contains: view.search, mode: "insensitive" },
		// 	  },
		// 	};
		//   }
	  
		// ? {
		// 	cells: {
		// 		some: {
		// 			value: {
		// 				NOT: {
		// 					contains: exclude,
		// 					mode: 'insensitive', // Optional: case-insensitive search
		// 				},
		// 			},
		// 		},
		// 	},
		// }

		const rows = await ctx.db.row.findMany({
			where: { 
				tableId: tableId,
				cells: filter ? {
					some: {
						value: {
							contains: filter,
							mode: 'insensitive', // Optional: case-insensitive search
						},
					},
				} : undefined,
			 },
			take: limit + 1,
			cursor: cursor ? { id: cursor } : undefined,
			include: {
				cells: true,
				
			},
			orderBy: { id: "asc" },

		});
		// console.log('rows >>>> ', rows);
		let nextCursor: typeof cursor | null = null;
		if (rows.length > limit) {
			const nextItem = rows.pop();
			// console.log('nextItem >>>> ', nextItem);
			nextCursor = nextItem!.id;
		}
console.log('rows.map >>>> ', rows);
		const rowData = rows.map((row) => {
			const rowData: Data = {};
			row.cells.forEach((cell) => {
				rowData[cell.columnId] = { id: cell.id, value: cell.value, rowId: row.id, columnId: cell.columnId };
			});
			return rowData;
		});

		// console.log('rowData >>>> ', rowData);

		
		//   // Apply column filters
		//   if (view?.filters) {
		// 	whereConditions.cells = {
		// 	  some: {
		// 		OR: view.filters.map(filter => ({
		// 		  columnId: filter.columnId,
		// 		  value:
		// 			filter.operator === ">"
		// 			  ? { gt: filter.value }
		// 			  : filter.operator === "<"
		// 			  ? { lt: filter.value }
		// 			  : filter.operator === "="
		// 			  ? { equals: filter.value }
		// 			  : filter.operator === "contains"
		// 			  ? { contains: filter.value }
		// 			  : undefined,
		// 		})),
		// 	  },
		// 	};
		//   }
	  
		//   // Fetch table with filters, sorting, and hidden columns applied
		//   const table = await prisma.table.findUnique({
		// 	where: { id: parseInt(tableId) },
		// 	include: {
		// 	  columns: {
		// 		where: {
		// 		  id: { notIn: view?.hiddenCols || [] },
		// 		},
		// 	  },
		// 	  rows: {
		// 		where: whereConditions,
		// 		include: {
		// 		  cells: true,
		// 		},
		// 		orderBy: view?.sort?.map(s => ({
		// 		  cells: {
		// 			columnId: s.columnId,
		// 			value: s.direction,
		// 		  },
		// 		})),
		// 	  },
		// 	},
		//   });
		

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


