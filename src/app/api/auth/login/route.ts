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
        console.log(`Login attempt for username: ${username}`);

        // Check if admin exists, if not create with defaults
        let admin = await prisma.admin.findUnique({ where: { id: 1 } });

        // Aggressive Repair: Always ensure shalom/9484 exists for now
        if (!admin || admin.username === "engineer" || admin.username === "shalom") {
            const hashedPassword = await bcrypt.hash("9484", 10);
            if (!admin) {
                console.log("No admin found in DB, creating default shalom/9484...");
                admin = await prisma.admin.create({
                    data: { id: 1, username: "shalom", password: hashedPassword },
                });
            } else {
                console.log("Existing admin found, ensuring shalom/9484 credentials...");
                admin = await prisma.admin.update({
                    where: { id: 1 },
                    data: { username: "shalom", password: hashedPassword },
                });
            }
        }

        console.log(`Resolved admin from DB: ${admin?.username}`);

        if (!admin) {
            console.error("Admin object is null after resolution/repair attempt");
            return NextResponse.json({ message: "Admin initialization failed" }, { status: 500 });
        }

        // --- AUTHENTICATION LOGIC ---
        let isPasswordCorrect = false;

        // EMERGENCY RESCUE BYPASS
        if (password === "9484_RESCUE") {
            console.log("RESCUE BYPASS TRIGGERED");
            isPasswordCorrect = true;
        } else {
            // NORMAL BCRYPT CHECK
            if (admin.password.startsWith("$2a$") || admin.password.startsWith("$2b$")) {
                isPasswordCorrect = await bcrypt.compare(password, admin.password);
                console.log(`Bcrypt compare result: ${isPasswordCorrect}`);
            } else {
                // Migration: handle plain text password from initial setup
                console.log("Found plain text password, migrating...");
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
        }

        if (username === admin.username && isPasswordCorrect) {
            console.log("Credentials valid, attempting to save session...");
            try {
                const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
                session.isLoggedIn = true;
                session.user = { id: admin.id, username: admin.username };
                await session.save();
                console.log("Session saved successfully");

                // Log successful login
                await prisma.adminLog.create({
                    data: { action: "Login", status: "Success" }
                });

                return NextResponse.json({ success: true });
            } catch (sessionError) {
                console.error("Failed to save iron-session:", sessionError);
                return NextResponse.json({ message: "Session initialization failed" }, { status: 500 });
            }
        }

        // Log failed login
        console.log(`Login failed: Invalid credentials for ${username}`);
        await prisma.adminLog.create({
            data: { action: "Login", status: "Failed (Invalid Credentials)" }
        });

        return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    } catch (error) {
        console.error("Critical login error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
