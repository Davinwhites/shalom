import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const env = await prisma.schoolEnvironment.findMany({
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(env);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch environment items" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const env = await prisma.schoolEnvironment.create({ data: body });
        return NextResponse.json(env);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create environment item" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { id, ...data } = body;
        const env = await prisma.schoolEnvironment.update({
            where: { id: Number(id) },
            data
        });
        return NextResponse.json(env);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update environment item" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await prisma.schoolEnvironment.delete({ where: { id: Number(id) } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete environment item" }, { status: 500 });
    }
}
