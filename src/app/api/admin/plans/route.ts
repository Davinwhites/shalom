export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const plans = await prisma.plan.findMany({
        orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(plans);
}

export async function POST(req: NextRequest) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const data = await req.json();
        const plan = await prisma.plan.create({
            data: {
                title: data.title,
                description: data.description,
                imageUrl: data.imageUrl,
            },
        });
        return NextResponse.json(plan);
    } catch (error) {
        return NextResponse.json({ message: "Failed to create plan" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const data = await req.json();
        const { id, title, description, imageUrl } = data;

        if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });

        const plan = await prisma.plan.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                imageUrl,
            },
        });
        return NextResponse.json(plan);
    } catch (error) {
        return NextResponse.json({ message: "Failed to update plan" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });

        await prisma.plan.delete({
            where: { id: parseInt(id) },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ message: "Failed to delete plan" }, { status: 500 });
    }
}
