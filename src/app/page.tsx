import { getServerSession, Session } from 'next-auth';
import React from 'react'
import { authOptions } from './api/auth/[...nextauth]/route';
import LoginPage from './(auth)/login/page';
import HomePage from './homePage';

export default async function Home() {
  const session: Session | null = await getServerSession(authOptions);
  return (
    <>
      {!session ? <LoginPage/> : <HomePage/>}
    </>
  )
}
