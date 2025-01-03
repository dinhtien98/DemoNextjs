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
          <div className='p-4 m-4 flex flex-col md:flex-row gap-4'>
            <div className='p-4 w-full md:w-1/6 bg-white shadow-lg rounded-lg'>
              <div className='font-bold'>
                <a href="/" className="text-blue-700">
                  <i className="pi pi-home mr-2"></i>Dashboard
                </a>
              </div>
              <ul className="menu p-4 text-lg font-bold">
                <li className="menu-item p-2">
                  <a href="/user" className="text-black hover:text-blue-700">
                    <i className="pi pi-user mr-2"></i>User
                  </a>
                </li>
                <li className="menu-item p-2">
                  <a href="/page" className="text-black hover:text-blue-700">
                    <i className="pi pi-file mr-2"></i>Page
                  </a>
                </li>
                <li className="menu-item p-2">
                  <a href="/role" className="text-black hover:text-blue-700">
                    <i className="pi pi-users mr-2"></i>Role
                  </a>
                </li>
              </ul>
            </div>
            <div className='p-4 w-full md:w-5/6 bg-white shadow-lg rounded-lg'>
            </div>
          </div>
        </>
      )}
    </>
  )
}
