import LoginPage from '@/app/(auth)/login/page';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession, Session } from 'next-auth';
import React from 'react'
import TableProduct from './tableProduct';

export default async function page() {
    const session: Session | null = await getServerSession(authOptions);
    return (
        <div>
            {session ?<TableProduct session={session} /> : <LoginPage/>}
        </div>
    )
}
