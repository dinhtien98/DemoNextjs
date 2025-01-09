/* eslint-disable @next/next/no-html-link-for-pages */
import { getServerSession, Session } from 'next-auth';
import React from 'react'
import { authOptions } from './api/auth/[...nextauth]/route';
import LoginPage from './(auth)/login/page';

export default async function Home() {
  const session: Session | null = await getServerSession(authOptions);
  return (
    <>
      {!session ? <LoginPage /> : (
        <>
          
        </>
      )}
    </>
  )
}
