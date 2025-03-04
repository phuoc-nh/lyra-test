import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

interface CreateBaseRequestBody {
	name: string;
}
export async function POST(req: Request) {
	try {
		const session = await auth();
		if (!session) {
			return NextResponse.redirect('/login');
		}

		const body: CreateBaseRequestBody = await req.json();
		const newBase = await db.base.create({
			data: {
				name: body.name,
				userId: session.user.id
			}
		})

		revalidatePath('/');

		return NextResponse.json({
			baseId: newBase.id
		});
	} catch (error) {
		console.error('Failed to insert base', error);
		return NextResponse.json({ error: 'Failed to insert base' }, { status: 500 });
	}
}

export async function GET() {
	try {
		const session = await auth();
		if (!session) {
			return NextResponse.redirect('/login');
		}
		const bases = await db.base.findMany({
			where: {
				userId: session.user.id
			}
		});
		return NextResponse.json(bases, { status: 200 });
	} catch (error) {
		console.error('Failed to fetch bases', error);
		return NextResponse.json({ error: 'Failed to fetch bases' }, { status: 500 });
	}
}

