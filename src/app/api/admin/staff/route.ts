import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const staff = await prisma.staffMember.findMany({
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(staff);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const staff = await prisma.staffMember.create({ data: body });
        return NextResponse.json(staff);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create staff member" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { id, ...data } = body;
        const staff = await prisma.staffMember.update({
            where: { id: Number(id) },
            data
        });
        return NextResponse.json(staff);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update staff member" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await prisma.staffMember.delete({ where: { id: Number(id) } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete staff member" }, { status: 500 });
    }
}
