import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    if (session.isLoggedIn) {
        return NextResponse.json({ isLoggedIn: true, user: session.user });
    }

    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
}
