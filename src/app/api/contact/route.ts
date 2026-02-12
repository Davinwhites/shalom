import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    try {
        const { name, email, projectType, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Fetch admin contact info for the recipient email
        const adminContact = await prisma.contactInfo.findUnique({ where: { id: 1 } });
        const adminEmail = adminContact?.email || process.env.EMAIL_USER;

        if (!adminEmail) {
            console.error("No admin email configured");
            return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
        }

        // Configure nodemailer transporter
        // These environment variables should be set in .env
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: adminEmail,
            subject: `New Project Inquiry from ${name}`,
            text: `
                Name: ${name}
                Email: ${email}
                Project Type: ${projectType || "N/A"}
                
                Message:
                ${message}
            `,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #2563eb;">New Project Inquiry</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Project Type:</strong> ${projectType || "N/A"}</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p><strong>Message:</strong></p>
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>
            `,
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail(mailOptions);
            return NextResponse.json({ success: true, message: "Enquiry sent successfully" });
        } else {
            console.warn("Nodemailer not configured, logging message to console instead");
            console.log("Form Submission:", { name, email, projectType, message });
            return NextResponse.json({
                success: true,
                message: "Enquiry received (Simulation mode: SMTP not configured)"
            });
        }

    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json({ message: "Failed to send enquiry" }, { status: 500 });
    }
}
