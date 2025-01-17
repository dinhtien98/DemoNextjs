import { getServerSession, Session } from 'next-auth';
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route';
import AdminPage from './adminPage';
import LoginPage from '../(auth)/login/page';

export default async function page() {
    const session: Session | null = await getServerSession(authOptions);
    return (
      <div>{session ?<AdminPage session={session} /> : <LoginPage/>}</div>
      
    )
}
