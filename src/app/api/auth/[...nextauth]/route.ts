import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextApiHandler } from "next";

declare module "next-auth" {
    interface User {
        fullName?: string;
        token?: string;
        id?: string;
        roleCode?: JSON
    }

    interface Session {
        token?: string;
        id?: string;
        user?: {
            id?: string;
            fullName?: string;
            token?: string;
            roleCode?: JSON
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
                            redirect: false,
                        }),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (!res.ok) {
                        const errorResponse = await res.json();
                        throw new Error(errorResponse.message || "Invalid credentials");
                    }

                    const responseData = await res.json();
                    if (!responseData || !responseData.data.token) {
                        throw new Error(responseData.data.token || "Authentication failed");
                    }
                    if(!responseData || !responseData.data.userName){
                        throw new Error(responseData.data.token || "Authentication failed");
                    }

                    return {
                        id: responseData.data.id,
                        token: responseData.data.token,
                        fullName: responseData.data.fullName,
                        roleCode: responseData.data.roleCode,
                    };
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(error.message || "An error occurred during authentication");
                    }
                    throw new Error("An unknown error occurred during authentication");
                }
            },
        })
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
                token.roleCode = user.roleCode;
            }
            return token;
        },
        async session({ session, token }) {
            session.token = token.token as string;
            session.user = {
                id: token.id as string,
                fullName: token.fullName as string,
                token: token.token as string,
                roleCode: token.roleCode as JSON
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
    secret: process.env.NEXTAUTH_SECRET,
};

const handler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions);

export { handler as GET, handler as POST };
