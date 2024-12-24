/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

declare module "next-auth" {
  interface User {
    id: string;
    userName?: string | null;
    fullName?: string | null;
    expires?: Date | null;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      token: any;
      id: string;
      userName?: string | null;
      fullName?: string | null;
      expires?: Date | null;
    };
  }
}

export const authOptions = {
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
                    const decoded = jwt.decode(responseData.data.token) as jwt.JwtPayload;
                    if (!decoded) {
                        console.error("Failed to decode token");
                        return null;
                    }
                    return {
                        id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
                        userName: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
                        fullName: decoded['FullName'],
                        token: responseData.data.token
                    };
                } catch (error) {
                    console.error("Error during authentication:", error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt" as const,
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }: { token: any, user?: any }) {
            if (user) {
                token.sub = user.id;
                token.userName = user.userName;
                token.fullName = user.fullName;
                token.token = user.token;
            }
            return token;
        },
        async session({ session, token }: { session: any, token: any }) {
            if (session.user) {
                session.user.id = token.sub as string;
                session.user.userName = token.userName as string | null | undefined;
                session.user.fullName = token.fullName as string | null | undefined;
                session.user.token = token.token;
            }
            return session;
        },
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production", 
                sameSite: "Lax", 
                path: "/",
                maxAge: 30 * 24 * 60 * 60,
            },
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
