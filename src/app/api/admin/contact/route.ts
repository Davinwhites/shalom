export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    let contact = await prisma.contactInfo.findUnique({ where: { id: 1 } });
    if (!contact) {
        contact = await prisma.contactInfo.create({ data: { id: 1 } });
    }
    return NextResponse.json(contact);
}

export async function PUT(req: NextRequest) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const data = await req.json();
        await prisma.contactInfo.update({
            where: { id: 1 },
            data: {
                email: data.email,
                phone: data.phone,
                address: data.address,
                linkedin: data.linkedin,
            },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ message: "Failed to update contact info" }, { status: 500 });
    }
}
