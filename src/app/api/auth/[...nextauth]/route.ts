import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextApiHandler } from "next";

declare module "next-auth" {
    interface User {
        fullName?: string;
        token?: string;
        id?: string;
    }

    interface Session {
        token?: string;
        id?: string;
        user?: {
            id?: string;
            fullName?: string;
        };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                userName: { label: "Username", type: "text", placeholder: "Enter your username" },
                password: { label: "Password", type: "password", placeholder: "Enter your password" },
            },
            async authorize(credentials) {
                try {
                    const res = await fetch("http://localhost:5004/api/authLogin", {
                        method: "POST",
                        body: JSON.stringify({
                            userName: credentials?.userName,
                            password: credentials?.password,
                        }),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (!res.ok) {
                        console.error("Failed to authenticate:", res.statusText);
                        return null;
                    }

                    const responseData = await res.json();
                    console.log("responseData", responseData);
                    if (!responseData || !responseData.data.token) {
                        console.error("Failed to retrieve token");
                        return null;
                    }

                    return {
                        id: responseData.data.userId,
                        token: responseData.data.token,
                        fullName: responseData.data.fullName,
                    };
                } catch (error) {
                    console.error("Error during authentication:", error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.token = user.token;
                token.fullName = user.fullName;
            }
            return token;
        },
        async session({ session, token }) {
            session.token = token.token as string;
            session.user = {
                id: token.id as string,
                fullName: token.fullName as string,
            };
            return session;
        },
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Lax",
                path: "/",
                maxAge: 30 * 24 * 60 * 60,
            },
        },
    },
    jwt: {
        encode: async ({ token }) => {
            if (token) {
                return JSON.stringify(token);
            }
            throw new Error("Invalid token format for encoding.");
        },
        decode: async ({ token }) => {
            if (!token) {
                throw new Error("Token is undefined.");
            }
            return JSON.parse(token);
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions);

export { handler as GET, handler as POST };
