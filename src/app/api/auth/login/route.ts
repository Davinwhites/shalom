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
        if (!admin) {
            console.log("No admin found, creating default admin...");
            const hashedPassword = await bcrypt.hash("94840", 10);
            try {
                admin = await prisma.admin.create({
                    data: {
                        id: 1,
                        username: "engineer",
                        password: hashedPassword,
                    },
                });
            } catch (e) {
                // Handle race condition if multiple requests hit this at once
                admin = await prisma.admin.findUnique({ where: { id: 1 } });
            }
        }

        // Seeding other tables if empty
        const homeExists = await prisma.homePage.findUnique({ where: { id: 1 } });
        if (!homeExists) {
            await prisma.homePage.create({
                data: {
                    id: 1,
                    heroTitle: "Precision Engineering for a Sustainable Future",
                    heroSub: "Innovative structural solutions and technical expertise for modern infrastructure.",
                    aboutShort: "A dedicated professional engineer with over 10 years of experience in structural design and project management."
                }
            });
        }

        const aboutExists = await prisma.aboutPage.findUnique({ where: { id: 1 } });
        if (!aboutExists) {
            await prisma.aboutPage.create({
                data: {
                    id: 1,
                    bio: "With a passion for structural integrity and innovative design, I have spent my career solving complex engineering challenges. My background includes a wide range of projects from residential developments to large-scale infrastructure.",
                    mission: "To provide world-class engineering solutions that empower communities and build a sustainable future through technical excellence and unwavering integrity.",
                    experience: "B.S. in Civil Engineering, P.E. Licensed. Lead engineer on over 50 successful structural projects. Expert in modern CAD/BIM technologies and sustainable building practices."
                }
            });
        }

        const contactExists = await prisma.contactInfo.findUnique({ where: { id: 1 } });
        if (!contactExists) {
            await prisma.contactInfo.create({
                data: {
                    id: 1,
                    email: "info@engineer-pro.com",
                    phone: "+1 (555) 123-4567",
                    address: "456 Innovation Drive, Suite 100, Tech City, ST 90210"
                }
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
