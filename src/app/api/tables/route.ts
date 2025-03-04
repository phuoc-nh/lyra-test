import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function GET(req: Request) {

	const url = new URL(req.url);
	const tableId = url.searchParams.get("tableId");

	if (!tableId) {
		return NextResponse.json({ error: "tableId is required" }, { status: 400 });
	}

	const table = await db.table.findUnique({
		where: { id: tableId },
		include: {
			columns: true,
			rows: {
				include: {
					cells: true,
				},
			},
		},
	});


	

	if (!table) {
		return NextResponse.json({ error: "Table not found" }, { status: 404 });
	}

	return NextResponse.json(table);
}

