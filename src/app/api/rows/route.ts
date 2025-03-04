import { NextResponse } from "next/server";
import { db } from "~/server/db";

interface AddRowRequestBody {
  tableId: string;
}

export async function POST(req: Request) {
  try {
    const body: AddRowRequestBody = await req.json();
    const { tableId } = body;

    const newRow = await db.row.create({
      data: {
        tableId,
      },
    });

    const columns = await db.column.findMany({
      where: {
        tableId
      }
    });

    const cellPromises = columns.map((column) => db.cell.create({
      data: {
        value: '',
        columnId: column.id,
        rowId: newRow.id
      }
    }));

    const createdCells = await Promise.all(cellPromises);

    return NextResponse.json({
      row: newRow,
      cells: createdCells
    }, { status: 200 });
  } catch (error) {
    console.error('Failed to add row', error);
    return NextResponse.json({ error: 'Failed to add row' }, { status: 500 });
  }
}
