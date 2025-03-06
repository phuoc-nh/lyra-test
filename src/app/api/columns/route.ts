import { NextResponse } from "next/server";
import { db } from "~/server/db";

interface AddColumnRequestBody {
  tableId: string;
  name: string;
  type: string;
}

export async function POST(req: Request) {
  try {
    const body: AddColumnRequestBody = await req.json();
    const { tableId, name, type } = body;

    const newColumn = await db.column.create({
      data: {
        name,
        type,
        tableId,
      },
    });

    // Create cells for each row in the table
    const rows = await db.row.findMany({
      where: {
        tableId,
      },
	});
	  

    const cellsData = rows.map((row) => ({
      value: '',
      columnId: newColumn.id,
      rowId: row.id,
    }));

    await db.cell.createMany({
      data: cellsData,
    });

    // Fetch the created cells
    const createdCells = await db.cell.findMany({
      where: {
        columnId: newColumn.id,
      },
    });

    return NextResponse.json({
      column: newColumn,
      cells: createdCells,
    }, { status: 200 });
  } catch (error) {
    console.error('Failed to add column', error);
    return NextResponse.json({ error: 'Failed to add column' }, { status: 500 });
  }
}
