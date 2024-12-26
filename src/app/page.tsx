import Dashboard from '@/components/dashboard'
import { getServerSession, Session } from 'next-auth';
import React from 'react'
import { authOptions } from './api/auth/[...nextauth]/route';
import LoginPage from './(auth)/login/page';

export default async function Home() {
  const session: Session | null = await getServerSession(authOptions);
  return (
    <div>
      {session ? <Dashboard session={session} /> : <LoginPage />}
    </div>
  )
}
