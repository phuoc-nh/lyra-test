import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";
export type Data = Record<string, { id: number, value: string | number | null, rowId: number, columnId: number }>;

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

});


