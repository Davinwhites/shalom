export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const admin = await prisma.admin.findUnique({ where: { id: 1 } });
    const settings = await prisma.schoolSettings.findUnique({ where: { id: 1 } });

    return NextResponse.json({
        username: admin?.username,
        schoolName: settings?.name,
        logoUrl: settings?.logoUrl
    });
}

export async function PUT(req: NextRequest) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const { username, password, schoolName, logoUrl } = await req.json();

        // Update Admin Credentials
        if (username || password) {
            const adminUpdate: any = {};
            if (username) adminUpdate.username = username;
            if (password && password.trim() !== "") {
                adminUpdate.password = await bcrypt.hash(password, 10);
            }
            await prisma.admin.update({
                where: { id: 1 },
                data: adminUpdate,
            });
        }

        // Update School Settings
        if (schoolName || logoUrl) {
            await prisma.schoolSettings.upsert({
                where: { id: 1 },
                update: {
                    name: schoolName,
                    logoUrl: logoUrl
                },
                create: {
                    id: 1,
                    name: schoolName || "Shalom Kindergarten & Primary School",
                    logoUrl: logoUrl || "/logo.jpeg"
                }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ message: "Failed to update settings" }, { status: 500 });
    }
}
