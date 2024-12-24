'use server'
import { cookies } from "next/headers";

export const getCookie = async (name: string) => {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(name);
    if (sessionToken) {
        return sessionToken;
    }
    return null;
};