import { getServerSession, Session } from 'next-auth';
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route';
import TableRole from './tableRole';
import LoginPage from '../(auth)/login/page';

export default async function page() {
    const session: Session | null = await getServerSession(authOptions);
  return (
    <div>{session ?<TableRole session={session} /> : <LoginPage />}</div>
  )
}
