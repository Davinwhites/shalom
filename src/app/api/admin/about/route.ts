export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    let about = await prisma.aboutPage.findUnique({ where: { id: 1 } });
    if (!about) {
        about = await prisma.aboutPage.create({ data: { id: 1 } });
    }
    return NextResponse.json(about);
}

export async function PUT(req: NextRequest) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const data = await req.json();
        await prisma.aboutPage.update({
            where: { id: 1 },
            data: {
                bio: data.bio,
                mission: data.mission,
                experience: data.experience,
            },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ message: "Failed to update about page" }, { status: 500 });
    }
}
