import { getServerSession, Session } from 'next-auth';
import React from 'react'
import { authOptions } from './api/auth/[...nextauth]/route';
import LoginPage from './(auth)/login/page';
import Dashboard from './dashboard';

export default async function Home() {
  const session: Session | null = await getServerSession(authOptions);
  

  return (
    <>
      {!session ? <LoginPage /> : <Dashboard session={session}/>}
    </>
  )
}
