import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const settings = await prisma.schoolSettings.findUnique({ where: { id: 1 } });
        return NextResponse.json(settings || { name: "Shalom Kindergarten & Primary School", logoUrl: "/logo.jpeg" });
    } catch (error) {
        return NextResponse.json({ name: "Shalom Kindergarten & Primary School", logoUrl: "/logo.jpeg" });
    }
}
