export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.isLoggedIn) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        console.log("Manual Repair Triggered...");

        // 1. Repair Admin
        const admin = await prisma.admin.findUnique({ where: { id: 1 } });
        if (admin && admin.username === "engineer") {
            await prisma.admin.update({
                where: { id: 1 },
                data: { username: "shalom" }
            });
        }

        // 2. Repair School Settings
        await prisma.schoolSettings.upsert({
            where: { id: 1 },
            update: {
                name: "Shalom Kindergarten & Primary School",
                logoUrl: "/logo.jpeg"
            },
            create: {
                id: 1,
                name: "Shalom Kindergarten & Primary School",
                logoUrl: "/logo.jpeg"
            }
        });

        // 3. Repair Home Page
        await prisma.homePage.upsert({
            where: { id: 1 },
            update: {
                heroTitle: "Shalom Kindergarten & Primary School",
                heroSub: "Nurturing Excellence, Inspiring Futures.",
                aboutShort: "Founded on the principles of love and integrity, we provide a holistic education that prepares children for a lifetime of success."
            },
            create: {
                id: 1,
                heroTitle: "Shalom Kindergarten & Primary School",
                heroSub: "Nurturing Excellence, Inspiring Futures.",
                aboutShort: "Founded on the principles of love and integrity, we provide a holistic education that prepares children for a lifetime of success."
            }
        });

        // 4. Force Seed Staff if they are common "engineer" placeholders or empty
        const staff = await prisma.staffMember.findMany();
        if (staff.length === 0 || staff.some(s => s.name.toLowerCase().includes("engineer"))) {
            // Delete existing placeholders if any
            if (staff.length > 0) {
                await prisma.staffMember.deleteMany({});
            }

            await prisma.staffMember.createMany({
                data: [
                    { name: "Mrs. Sarah Namasoko", title: "Principal", phone: "+256 701 000000", order: 1 },
                    { name: "Mr. James Okello", title: "Administrator", phone: "+256 702 000000", order: 2 },
                    { name: "Ms. Juliet Atieno", title: "Head Teacher", phone: "+256 703 000000", order: 3 },
                    { name: "Mr. David Mukasa", title: "Bursar", phone: "+256 704 000000", order: 4 },
                ]
            });
        }

        // 5. Repair About Page
        await prisma.aboutPage.upsert({
            where: { id: 1 },
            update: {
                bio: "Shalom Kindergarten & Primary School is a premier educational institution dedicated to providing a supportive and enriched learning environment for young learners.",
                mission: "To empower every child with the knowledge, skills, and values they need to thrive in a changing world.",
                experience: "Years of dedicated service in nurturing young minds and fostering academic excellence."
            },
            create: {
                id: 1,
                bio: "Shalom Kindergarten & Primary School is a premier educational institution dedicated to providing a supportive and enriched learning environment for young learners.",
                mission: "To empower every child with the knowledge, skills, and values they need to thrive in a changing world.",
                experience: "Years of dedicated service in nurturing young minds and fostering academic excellence."
            }
        });

        return NextResponse.json({ success: true, message: "System repaired successfully!" });
    } catch (error: any) {
        console.error("Repair error:", error);
        return NextResponse.json({ message: "Failed to repair system: " + error.message }, { status: 500 });
    }
}
