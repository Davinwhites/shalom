import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { path } = await req.json();

        if (!path) return NextResponse.json({ message: "Path required" }, { status: 400 });

        await prisma.pageView.create({
            data: { path }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ message: "Failed to track view" }, { status: 500 });
    }
}
