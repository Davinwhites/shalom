export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    let home = await prisma.homePage.findUnique({ where: { id: 1 } });
    if (!home) {
        home = await prisma.homePage.create({ data: { id: 1 } });
    }
    return NextResponse.json(home);
}

export async function PUT(req: NextRequest) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const data = await req.json();
        await prisma.homePage.update({
            where: { id: 1 },
            data: {
                heroTitle: data.heroTitle,
                heroSub: data.heroSub,
                aboutShort: data.aboutShort,
            },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ message: "Failed to update home page" }, { status: 500 });
    }
}
