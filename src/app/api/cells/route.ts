import { NextResponse } from "next/server";
import { db } from "~/server/db";

interface UpdateCellRequestBody {
  cellId: string;
  value: string | number;
}

export async function PUT(req: Request) {
  try {
    const body: UpdateCellRequestBody = await req.json();
    const { cellId, value } = body;

    const updatedCell = await db.cell.update({
      where: { id: parseInt(cellId) },
      data: { value: value.toString() },
    });

    return NextResponse.json(updatedCell, { status: 200 });
  } catch (error) {
    console.error('Failed to update cell', error);
    return NextResponse.json({ error: 'Failed to update cell' }, { status: 500 });
  }
}
