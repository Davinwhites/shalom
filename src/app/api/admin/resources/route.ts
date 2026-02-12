export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const resources = await prisma.resource.findMany({
        orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(resources);
}

export async function POST(req: NextRequest) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const data = await req.json();
        const resource = await prisma.resource.create({
            data: {
                title: data.title,
                description: data.description,
                link: data.link,
            },
        });
        return NextResponse.json(resource);
    } catch (error) {
        return NextResponse.json({ message: "Failed to create resource" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });

        await prisma.resource.delete({
            where: { id: parseInt(id) },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ message: "Failed to delete resource" }, { status: 500 });
    }
}
