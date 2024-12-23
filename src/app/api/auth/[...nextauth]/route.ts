import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
    interface User {
        token?: string;
        id?: string;
    }

    interface Session {
        user: {
            id?: string;
            token?: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const res = await fetch("https://localhost:7223/api/authLogin", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: credentials?.username,
                        password: credentials?.password
                    })
                });

                const data = await res.json();

                if (res.ok && data?.data) {
                    return {
                        id: "1",
                        name: data.data.fullName,
                        email: credentials?.username,
                        token: data.data.token
                    };
                } else {
                    return null;
                }
            }
        })
    ],

    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.token = user.token;
            }
            return token;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async session({ session, token }: { session: Session; token: any }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.token = token.token;
            }
            return session;
        }
    }
});

export { handler as GET, handler as POST };