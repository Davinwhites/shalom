import { SessionOptions } from "iron-session";

export interface SessionData {
    user?: {
        id: number;
        username: string;
    };
    isLoggedIn: boolean;
}

export const sessionOptions: SessionOptions = {
    password: "complex_password_at_least_32_characters_long",
    cookieName: "engineer_session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        path: "/",
        sameSite: "lax",
    },
};
