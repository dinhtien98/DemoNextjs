import { getServerSession, Session } from 'next-auth';
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route';
import LoginPage from '../(auth)/login/page';
import TablePage from './tablePage';

export default async function page() {
    const session: Session | null = await getServerSession(authOptions);
    return (
        <div>
            {session ? <TablePage session={session} /> : <LoginPage />}
        </div>
    )
}
