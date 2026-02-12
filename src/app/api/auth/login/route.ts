export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        // Check if admin exists, if not create with defaults
        let admin = await prisma.admin.findUnique({ where: { id: 1 } });
        if (!admin || admin.username === "engineer") {
            const hashedPassword = await bcrypt.hash("94840", 10);
            if (!admin) {
                console.log("No admin found, creating default admin...");
                admin = await prisma.admin.create({
                    data: { id: 1, username: "shalom", password: hashedPassword },
                });
            } else {
                console.log("Repairing admin username...");
                admin = await prisma.admin.update({
                    where: { id: 1 },
                    data: { username: "shalom" },
                });
            }
        }

        // Seeding & Repairing other tables
        const home = await prisma.homePage.findUnique({ where: { id: 1 } });
        const shalomHeroTitle = "Shalom Kindergarten & Primary School";
        if (!home || home.heroTitle.includes("Engineering") || home.heroTitle.includes("Precision")) {
            const data = {
                id: 1,
                heroTitle: shalomHeroTitle,
                heroSub: "Nurturing Excellence, Inspiring Futures.",
                aboutShort: "Founded on the principles of love and integrity, we provide a holistic education that prepares children for a lifetime of success."
            };
            if (!home) {
                await prisma.homePage.create({ data });
            } else {
                await prisma.homePage.update({ where: { id: 1 }, data });
            }
        }

        const about = await prisma.aboutPage.findUnique({ where: { id: 1 } });
        if (!about || about.bio.includes("Engineering") || about.bio.includes("integrity")) {
            // Note: The previous "integrity" string was part of the engineering seeding
            const data = {
                id: 1,
                bio: "Shalom Kindergarten & Primary School is a premier educational institution dedicated to providing a supportive and enriched learning environment for young learners.",
                mission: "To empower every child with the knowledge, skills, and values they need to thrive in a changing world.",
                experience: "Years of dedicated service in nurturing young minds and fostering academic excellence."
            };
            if (!about) {
                await prisma.aboutPage.create({ data });
            } else {
                await prisma.aboutPage.update({ where: { id: 1 }, data });
            }
        }

        const contact = await prisma.contactInfo.findUnique({ where: { id: 1 } });
        if (!contact || contact.email.includes("engineer-pro.com")) {
            const data = {
                id: 1,
                email: "info@shalomschool.com",
                phone: "+123 456 7890",
                address: "Shalom Campus, Education St, City"
            };
            if (!contact) {
                await prisma.contactInfo.create({ data });
            } else {
                await prisma.contactInfo.update({ where: { id: 1 }, data });
            }
        }

        // Seed Staff if empty
        const staffCount = await prisma.staffMember.count();
        if (staffCount === 0) {
            console.log("Seeding default staff...");
            await prisma.staffMember.createMany({
                data: [
                    { name: "Mrs. Sarah Namasoko", title: "Principal", phone: "+256 701 000000", order: 1 },
                    { name: "Mr. James Okello", title: "Administrator", phone: "+256 702 000000", order: 2 },
                    { name: "Ms. Juliet Atieno", title: "Head Teacher", phone: "+256 703 000000", order: 3 },
                    { name: "Mr. David Mukasa", title: "Bursar", phone: "+256 704 000000", order: 4 },
                ]
            });
        }


        if (!admin) {
            return NextResponse.json({ message: "Admin initialization failed" }, { status: 500 });
        }

        let isPasswordCorrect = false;
        if (admin.password.startsWith("$2a$") || admin.password.startsWith("$2b$")) {
            isPasswordCorrect = await bcrypt.compare(password, admin.password);
        } else {
            // Migration: handle plain text password from initial setup
            if (password === admin.password) {
                isPasswordCorrect = true;
                // Update to hashed password for next time
                const hashedPassword = await bcrypt.hash(password, 10);
                await prisma.admin.update({
                    where: { id: admin.id },
                    data: { password: hashedPassword },
                });
            }
        }

        if (username === admin.username && isPasswordCorrect) {
            const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
            session.isLoggedIn = true;
            session.user = { id: admin.id, username: admin.username };
            await session.save();

            // Log successful login
            await prisma.adminLog.create({
                data: { action: "Login", status: "Success" }
            });

            console.log(`Login successful for user: ${username}`);
            return NextResponse.json({ success: true });
        }

        // Log failed login
        await prisma.adminLog.create({
            data: { action: "Login", status: "Failed (Invalid Credentials)" }
        });

        console.log(`Login failed for user: ${username} (Invalid credentials)`);
        return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    } catch (error) {
        // Log system error login
        await prisma.adminLog.create({
            data: { action: "Login", status: "Error (System Failure)" }
        });
        console.error("Login error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
